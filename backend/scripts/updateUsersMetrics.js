// Script para actualizar usuarios Julieta y Andrea en MongoDB con métricas semanales
import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = 'mongodb://localhost:27017/tp-semianrio'; // Cambia si tu URI es diferente

const metricsJulieta = {
  historical: {
    lastDay: {
      calls: 17,
      agreements: 4,
      totalCalls: 17,
      totalAgreements: 4,
      answeredCalls: 12,
      avgDuration: 25.8
    },
    historicalByWeek: [
      { semana: 1, llamadas: 30, acuerdos: 7, contestadas: 20, duracionPromedio: 22.5 },
      { semana: 2, llamadas: 25, acuerdos: 5, contestadas: 18, duracionPromedio: 20.1 },
      { semana: 3, llamadas: 28, acuerdos: 6, contestadas: 21, duracionPromedio: 24.0 },
      { semana: 4, llamadas: 32, acuerdos: 8, contestadas: 25, duracionPromedio: 23.2 }
    ]
  }
};

const metricsAndrea = {
  historical: {
    lastDay: {
      calls: 23,
      agreements: 6,
      totalCalls: 23,
      totalAgreements: 6,
      answeredCalls: 18,
      avgDuration: 22.3
    },
    historicalByWeek: [
      { semana: 1, llamadas: 40, acuerdos: 10, contestadas: 30, duracionPromedio: 21.5 },
      { semana: 2, llamadas: 35, acuerdos: 8, contestadas: 28, duracionPromedio: 19.8 },
      { semana: 3, llamadas: 38, acuerdos: 9, contestadas: 31, duracionPromedio: 22.7 },
      { semana: 4, llamadas: 36, acuerdos: 7, contestadas: 29, duracionPromedio: 20.9 }
    ]
  }
};

async function updateMetrics() {
  await mongoose.connect(MONGO_URI);
  await User.updateOne({ email: 'julieta@gmail.com' }, { $set: metricsJulieta });
  await User.updateOne({ email: 'andrea@gmail.com' }, { $set: metricsAndrea });
  console.log('Usuarios actualizados con métricas semanales.');
  await mongoose.disconnect();
}

updateMetrics();
