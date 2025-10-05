import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  contrasena: String,
  historical: {
    historicalByWeek: [
      {
        semana: Number,
        llamadas: Number,
        acuerdos: Number,
        dias: [
          {
            dia: String,
            llamadas: Number,
            contestadas: Number,
            acuerdos: Number,
            duracion: Number
          }
        ]
      }
    ],
    goalsByWeek: [
      {
        semana: Number,
        dailyCalls: Number,
        dailyAgreements: Number
      }
    ]
  }
});

export default mongoose.model('User', userSchema);

