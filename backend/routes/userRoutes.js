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
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.contrasena !== contrasena) return res.status(401).json({ error: 'Contraseña incorrecta' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;

