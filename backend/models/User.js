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
  }
});

export default mongoose.model('User', userSchema);

