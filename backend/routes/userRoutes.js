import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      historical: {
        goalsByWeek: [],
        historicalByMonth: [],
        historicalByWeek: []
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
    if (user.contrasena !== contrasena) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Asegurarse que el campo historical esté presente
    if (!user.historical) {
      user.historical = {
        goalsByWeek: [],
        historicalByMonth: [],
        historicalByWeek: []
      };
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para migrar datos de Julieta a la nueva estructura
router.post('/migrate-julieta', async (req, res) => {
  try {
    const julietaData = {
      "_id": "68e018c271d8d9144184de8e",
      "nombre": "Julieta",
      "apellido": "Pérez", 
      "email": "julieta@gmail.com",
      "contrasena": "julieta123",
      "historical": {
        "goalsByWeek": [
          { "semana": 1, "dailyCalls": 100, "dailyAgreements": 70 },
          { "semana": 2, "dailyCalls": 120, "dailyAgreements": 100 },
          { "semana": 3, "dailyCalls": 110, "dailyAgreements": 80 },
          { "semana": 4, "dailyCalls": 150, "dailyAgreements": 90 }
        ],
        "historicalByMonth": [
          {
            "mes": "Septiembre",
            "anio": 2025,
            "semanas": [
              {
                "semana": 1,
                "llamadas": 100,
                "acuerdos": 70,
                "contestadas": 85,
                "duracionPromedio": 22.4,
                "cumpleMeta": true
              },
              {
                "semana": 2,
                "llamadas": 125,
                "acuerdos": 60,
                "contestadas": 100,
                "duracionPromedio": 21.9,
                "cumpleMeta": false
              },
              {
                "semana": 3,
                "llamadas": 110,
                "acuerdos": 80,
                "contestadas": 70,
                "duracionPromedio": 23.0,
                "cumpleMeta": true
              },
              {
                "semana": 4,
                "llamadas": 130,
                "acuerdos": 95,
                "contestadas": 110,
                "duracionPromedio": 22.8,
                "cumpleMeta": true
              }
            ]
          }
        ],
        "historicalByWeek": [
          {
            "semana": 1,
            "llamadas": 100,
            "acuerdos": 70,
            "contestadas": 85,
            "duracionPromedio": 22.4,
            "cumpleMeta": true,
            "dias": [
              { "fecha": "2025-09-01", "dia": "Lunes", "llamadas": 18, "contestadas": 15, "acuerdos": 12, "duracion": 22.1, "cumpleMeta": true },
              { "fecha": "2025-09-02", "dia": "Martes", "llamadas": 22, "contestadas": 18, "acuerdos": 14, "duracion": 23.5, "cumpleMeta": true },
              { "fecha": "2025-09-03", "dia": "Miércoles", "llamadas": 20, "contestadas": 17, "acuerdos": 14, "duracion": 21.8, "cumpleMeta": true },
              { "fecha": "2025-09-04", "dia": "Jueves", "llamadas": 19, "contestadas": 17, "acuerdos": 15, "duracion": 24.0, "cumpleMeta": true },
              { "fecha": "2025-09-05", "dia": "Viernes", "llamadas": 21, "contestadas": 18, "acuerdos": 15, "duracion": 20.5, "cumpleMeta": true }
            ]
          },
          {
            "semana": 2,
            "llamadas": 125,
            "acuerdos": 60,
            "contestadas": 100,
            "duracionPromedio": 21.9,
            "cumpleMeta": false,
            "dias": [
              { "fecha": "2025-09-08", "dia": "Lunes", "llamadas": 20, "contestadas": 18, "acuerdos": 10, "duracion": 21.5, "cumpleMeta": false },
              { "fecha": "2025-09-09", "dia": "Martes", "llamadas": 25, "contestadas": 20, "acuerdos": 12, "duracion": 22.0, "cumpleMeta": false },
              { "fecha": "2025-09-10", "dia": "Miércoles", "llamadas": 30, "contestadas": 24, "acuerdos": 13, "duracion": 21.2, "cumpleMeta": false },
              { "fecha": "2025-09-11", "dia": "Jueves", "llamadas": 25, "contestadas": 19, "acuerdos": 12, "duracion": 22.3, "cumpleMeta": false },
              { "fecha": "2025-09-12", "dia": "Viernes", "llamadas": 25, "contestadas": 19, "acuerdos": 13, "duracion": 21.5, "cumpleMeta": false }
            ]
          },
          {
            "semana": 3,
            "llamadas": 110,
            "acuerdos": 80,
            "contestadas": 70,
            "duracionPromedio": 23.0,
            "cumpleMeta": true,
            "dias": [
              { "fecha": "2025-09-15", "dia": "Lunes", "llamadas": 15, "contestadas": 12, "acuerdos": 16, "duracion": 22.8, "cumpleMeta": true },
              { "fecha": "2025-09-16", "dia": "Martes", "llamadas": 18, "contestadas": 14, "acuerdos": 17, "duracion": 23.5, "cumpleMeta": true },
              { "fecha": "2025-09-17", "dia": "Miércoles", "llamadas": 16, "contestadas": 12, "acuerdos": 18, "duracion": 23.0, "cumpleMeta": true },
              { "fecha": "2025-09-18", "dia": "Jueves", "llamadas": 20, "contestadas": 16, "acuerdos": 17, "duracion": 23.2, "cumpleMeta": true },
              { "fecha": "2025-09-19", "dia": "Viernes", "llamadas": 21, "contestadas": 16, "acuerdos": 17, "duracion": 22.5, "cumpleMeta": true }
            ]
          },
          {
            "semana": 4,
            "llamadas": 130,
            "acuerdos": 95,
            "contestadas": 110,
            "duracionPromedio": 22.8,
            "cumpleMeta": true,
            "dias": [
              { "fecha": "2025-09-22", "dia": "Lunes", "llamadas": 28, "contestadas": 24, "acuerdos": 18, "duracion": 22.0, "cumpleMeta": true },
              { "fecha": "2025-09-23", "dia": "Martes", "llamadas": 32, "contestadas": 28, "acuerdos": 19, "duracion": 23.0, "cumpleMeta": true },
              { "fecha": "2025-09-24", "dia": "Miércoles", "llamadas": 30, "contestadas": 26, "acuerdos": 18, "duracion": 22.5, "cumpleMeta": true },
              { "fecha": "2025-09-25", "dia": "Jueves", "llamadas": 30, "contestadas": 26, "acuerdos": 17, "duracion": 23.2, "cumpleMeta": true },
              { "fecha": "2025-09-26", "dia": "Viernes", "llamadas": 30, "contestadas": 26, "acuerdos": 18, "duracion": 22.5, "cumpleMeta": true }
            ]
          }
        ]
      }
    };

    // Buscar si Julieta ya existe
    let user = await User.findOne({ email: 'julieta@gmail.com' });
    
    if (user) {
      // Actualizar usuario existente
      user.historical = julietaData.historical;
      await user.save();
      res.status(200).json({ message: 'Datos de Julieta actualizados con éxito', user });
    } else {
      // Crear nuevo usuario
      user = new User(julietaData);
      await user.save();
      res.status(201).json({ message: 'Usuario Julieta creado con éxito', user });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al migrar datos: ' + err.message });
  }
});

export default router;

