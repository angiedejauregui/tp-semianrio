import express from "express";
import mongoose from "mongoose";
import Llamada from "../models/llamada.js";

const router = express.Router();

// Registrar una llamada
router.post("/realizar", async (req, res) => {
  const { usuarioId, duracion, contestada, acuerdo } = req.body;

  try {
    // Crear fecha local que se mantenga como tal en MongoDB
    const ahora = new Date();
    const offsetMinutos = ahora.getTimezoneOffset();
    const fechaLocal = new Date(ahora.getTime() - (offsetMinutos * 60000));
    
    const nuevaLlamada = new Llamada({
      usuario: usuarioId,
      fecha: fechaLocal,
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
          promedioDuracion: { 
            $avg: { 
              $cond: ["$contestada", "$duracion", null] 
            }
          }
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

// Datos por día de la semana actual
router.get("/semana/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // Calcular fechas de la semana actual (lunes a domingo)
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes...
    const diasAtrasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    
    const lunesActual = new Date(hoy);
    lunesActual.setDate(hoy.getDate() - diasAtrasHastaLunes);
    lunesActual.setHours(0, 0, 0, 0);
    
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const datosPorDia = [];
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(lunesActual);
      fecha.setDate(lunesActual.getDate() + i);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      
      const llamadasDelDia = await Llamada.find({
        usuario: usuarioId,
        fecha: { $gte: fecha, $lte: fechaFin }
      });
      
      const esHoy = fecha.toDateString() === hoy.toDateString();
      
      const llamadasContestadas = llamadasDelDia.filter(l => l.contestada);
      const totalDuracion = llamadasContestadas.reduce((sum, l) => sum + l.duracion, 0);
      const promedioDuracion = llamadasContestadas.length > 0 ? 
        parseFloat((totalDuracion / llamadasContestadas.length).toFixed(2)) : 0;
      
      datosPorDia.push({
        dia: diasSemana[i],
        llamadas: llamadasDelDia.length,
        acuerdos: llamadasDelDia.filter(l => l.acuerdo).length,
        contactRate: llamadasDelDia.length > 0 ? 
          Math.round((llamadasDelDia.filter(l => l.contestada).length / llamadasDelDia.length) * 100) : 0,
        promedioDuracion: promedioDuracion,
        esHoy: esHoy,
        fecha: fecha.toISOString().split('T')[0]
      });
    }
    
    res.json(datosPorDia);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos semanales" });
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
      promedioDuracion: 0,
      totalDuracion: 0
    };

    const llamadasContestadas = llamadasHoy.filter(l => l.contestada);
    if (llamadasContestadas.length > 0) {
      const totalDuracion = llamadasContestadas.reduce((sum, l) => sum + l.duracion, 0);
      metricas.promedioDuracion = parseFloat((totalDuracion / llamadasContestadas.length).toFixed(2));
      metricas.totalDuracion = totalDuracion;
    }

    // Devolver en el formato esperado por el frontend - evitar problemas de zona horaria
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    const fechaHoy = `${year}-${month}-${day}`;
    const porDia = {};
    porDia[fechaHoy] = metricas;



    res.json({ porDia });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener métricas diarias" });
  }
});

export default router;
