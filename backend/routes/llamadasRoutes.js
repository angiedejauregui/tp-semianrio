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
    res.status(201).json({ message: "Llamada registrada", llamada: nuevaLlamada });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar la llamada" });
  }
});

// Métricas generales por usuario
router.get("/metricas/:usuarioId", async (req, res) => {
  try {
    const llamadas = await Llamada.find({ usuario: req.params.usuarioId });

    const total = llamadas.length;
    const contestadas = llamadas.filter(l => l.contestada).length;
    const acuerdos = llamadas.filter(l => l.acuerdo).length;
    const duracionesContestadas = llamadas
      .filter(l => l.contestada)
      .map(l => l.duracion);

    const promedioDuracion = duracionesContestadas.length > 0
      ? duracionesContestadas.reduce((a, b) => a + b, 0) / duracionesContestadas.length
      : 0;

    res.json({
      total,
      contestadas,
      acuerdos,
      promedioDuracion: promedioDuracion.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener métricas" });
  }
});

// Resumen semanal por usuario (lunes a sábado)
router.get("/resumen/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const resumen = await Llamada.aggregate([
      { $match: { usuario: new mongoose.Types.ObjectId(usuarioId) } },
      {
        $project: {
          acuerdo: 1,
          contestada: 1,
          duracion: 1,
          diaSemana: { $dayOfWeek: "$fecha" } // 1 = domingo, 2 = lunes...
        }
      },
      {
        $match: {
          diaSemana: { $gte: 2, $lte: 7 } // lunes a sábado
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

    res.json(resumen[0] || {
      totalLlamadas: 0,
      acuerdosCerrados: 0,
      llamadasContestadas: 0,
      promedioDuracion: 0
    });
  } catch (err) {
    res.status(500).json({ error: "Error al generar resumen" });
  }
});

// Métricas agrupadas por día (para indicadores diarios)
router.get("/diarias/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const llamadas = await Llamada.find({ usuario: usuarioId });

    const porDia = {};

    llamadas.forEach(llamada => {
      const fechaStr = llamada.fecha.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!porDia[fechaStr]) {
        porDia[fechaStr] = {
          llamadas: 0,
          acuerdos: 0,
          contestadas: 0,
          duraciones: []
        };
      }

      porDia[fechaStr].llamadas += 1;
      if (llamada.acuerdo) porDia[fechaStr].acuerdos += 1;
      if (llamada.contestada) porDia[fechaStr].contestadas += 1;
      porDia[fechaStr].duraciones.push(llamada.duracion);
    });

    Object.keys(porDia).forEach(fecha => {
      const duraciones = porDia[fecha].duraciones;
      const promedio = duraciones.length > 0
        ? duraciones.reduce((a, b) => a + b, 0) / duraciones.length
        : 0;
      porDia[fecha].promedioDuracion = parseFloat(promedio.toFixed(2));
      delete porDia[fecha].duraciones;
    });

    res.json({ porDia });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener métricas diarias" });
  }
});

export default router;
