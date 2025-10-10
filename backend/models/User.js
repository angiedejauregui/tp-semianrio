import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  contrasena: String,
  historical: {
    goalsByWeek: [
      {
        semana: Number,
        dailyCalls: Number,
        dailyAgreements: Number
      }
    ],
    historicalByMonth: [
      {
        mes: String,
        anio: Number,
        semanas: [
          {
            semana: Number,
            llamadas: Number,
            acuerdos: Number,
            contestadas: Number,
            duracionPromedio: Number,
            cumpleMeta: Boolean
          }
        ]
      }
    ],
    historicalByWeek: [
      {
        semana: Number,
        llamadas: Number,
        acuerdos: Number,
        contestadas: Number,
        duracionPromedio: Number,
        cumpleMeta: Boolean,
        dias: [
          {
            fecha: String, // formato YYYY-MM-DD
            dia: String,   // nombre del día
            llamadas: Number,
            contestadas: Number,
            acuerdos: Number,
            duracion: Number,
            cumpleMeta: Boolean
          }
        ]
      }
    ]
  }
});

export default mongoose.model('User', userSchema);

