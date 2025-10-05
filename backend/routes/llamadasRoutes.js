import express from "express";
import mongoose from "mongoose";
import Llamada from "../models/llamada.js";

const router = express.Router();

// Registrar una llamada
router.post("/realizar", async (req, res) => {
  const { usuarioId, duracion, contestada, acuerdo } = req.body;

  try {
    const nuevaLlamada = new Llamada({
      usuario: usuarioId,
      duracion,
      contestada,
      acuerdo
    });

    await nuevaLlamada.save();
    res.status(201).json({ message: "Llamada registrada" });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar la llamada" });
  }
});

// Resumen semanal por usuario (semana actual: lunes a domingo)
router.get("/resumen/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Calcular fechas de la semana actual (lunes a domingo)
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes...
    const diasAtrasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    
    const lunesActual = new Date(hoy);
    lunesActual.setDate(hoy.getDate() - diasAtrasHastaLunes);
    lunesActual.setHours(0, 0, 0, 0);
    
    const domingoActual = new Date(lunesActual);
    domingoActual.setDate(lunesActual.getDate() + 6);
    domingoActual.setHours(23, 59, 59, 999);

    const resumen = await Llamada.aggregate([
      { 
        $match: { 
          usuario: new mongoose.Types.ObjectId(usuarioId),
          fecha: { $gte: lunesActual, $lte: domingoActual }
        }
      },
      {
        $project: {
          acuerdo: 1,
          contestada: 1,
          duracion: 1
        }
      },
      {
        $group: {
          _id: null,
          totalLlamadas: { $sum: 1 },
          acuerdosCerrados: { $sum: { $cond: ["$acuerdo", 1, 0] } },
          llamadasContestadas: { $sum: { $cond: ["$contestada", 1, 0] } },
          promedioDuracion: { $avg: "$duracion" }
        }
      }
    ]);
    
    const resultado = resumen[0] || {
      totalLlamadas: 0,
      acuerdosCerrados: 0,
      llamadasContestadas: 0,
      promedioDuracion: 0
    };
    
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: "Error al generar resumen" });
  }
});

// Métricas del día actual (se resetea cada día)
router.get("/diarias/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // Obtener solo las llamadas del día actual
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(inicioHoy);
    finHoy.setDate(finHoy.getDate() + 1);

    const llamadasHoy = await Llamada.find({ 
      usuario: usuarioId,
      fecha: { $gte: inicioHoy, $lt: finHoy }
    });

    // Calcular métricas del día actual
    const metricas = {
      llamadas: llamadasHoy.length,
      acuerdos: llamadasHoy.filter(l => l.acuerdo).length,
      contestadas: llamadasHoy.filter(l => l.contestada).length,
      promedioDuracion: 0
    };

    if (llamadasHoy.length > 0) {
      const totalDuracion = llamadasHoy.reduce((sum, l) => sum + l.duracion, 0);
      metricas.promedioDuracion = parseFloat((totalDuracion / llamadasHoy.length).toFixed(2));
    }

    // Devolver en el formato esperado por el frontend
    const fechaHoy = inicioHoy.toISOString().split("T")[0];
    const porDia = {};
    porDia[fechaHoy] = metricas;

    res.json({ porDia });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener métricas diarias" });
  }
});

export default router;
