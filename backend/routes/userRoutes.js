import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      goals: { dailyCalls: 10, agreements: 3 },
      currentDay: {
        calls: 0,
        agreements: 0,
        totalCalls: 0,
        totalAgreements: 0,
        answeredCalls: 0,
        callDurations: []
      },
      historical: {
        lastDay: {
          calls: 0,
          agreements: 0,
          totalCalls: 0,
          totalAgreements: 0,
          answeredCalls: 0,
          avgDuration: 0
        },
        historicalByWeek: [
          { semana: 1, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 2, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 3, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 4, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 }
        ]
      }
    });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;
  console.log('Login intento:', { email, contrasena });
  try {
    const user = await User.findOne({ email });
    console.log('Usuario encontrado:', user);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.contrasena !== contrasena) {
      console.log('Contraseña recibida:', contrasena, 'Contraseña en DB:', user.contrasena);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Asegurarse que el campo historical esté presente
    if (!user.historical) {
      user.historical = {
        lastDay: {
          calls: 0,
          agreements: 0,
          totalCalls: 0,
          totalAgreements: 0,
          answeredCalls: 0,
          avgDuration: 0
        },
        historicalByWeek: [
          { semana: 1, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 2, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 3, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 },
          { semana: 4, llamadas: 0, acuerdos: 0, contestadas: 0, duracionPromedio: 0 }
        ]
      };
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;

