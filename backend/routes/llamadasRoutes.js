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

// Métricas detalladas por usuario
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

// Resumen general por usuario (para tabla)
router.get("/resumen/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const resumen = await Llamada.aggregate([
      { $match: { usuario: new mongoose.Types.ObjectId(usuarioId) } },
      {
        $group: {
          _id: "$usuario",
          totalLlamadas: { $sum: 1 },
          llamadasContestadas: {
            $sum: { $cond: ["$contestada", 1, 0] }
          },
          acuerdosCerrados: {
            $sum: { $cond: ["$acuerdo", 1, 0] }
          },
          duracionTotal: { $sum: "$duracion" },
          promedioDuracion: { $avg: "$duracion" }
        }
      }
    ]);

    res.json(resumen[0] || {});
  } catch (err) {
    res.status(500).json({ error: "Error al generar resumen" });
  }
});

export default router;
