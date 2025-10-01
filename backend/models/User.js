import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  contrasena: String,
  goals: {
    dailyCalls: Number,
    agreements: Number
  },
  currentDay: {
    calls: Number,
    agreements: Number,
    totalCalls: Number,
    totalAgreements: Number,
    answeredCalls: Number,
    callDurations: [Number]
  },
  historical: {
    lastDay: {
      calls: Number,
      agreements: Number,
      totalCalls: Number,
      totalAgreements: Number,
      answeredCalls: Number,
      avgDuration: Number
    },
    historicalByWeek: [
      {
        semana: Number,
        llamadas: Number,
        acuerdos: Number,
        contestadas: Number,
        duracionPromedio: Number
      }
    ]
  }
});

export default mongoose.model('User', userSchema);

