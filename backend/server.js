import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import llamadasRoutes from './routes/llamadasRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/llamadas', llamadasRoutes);

// Ruta raíz para testeo
app.get('/', (req, res) => {
  res.send('✅ Backend activo y funcionando');
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Operadores', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(5000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:5000');
  });
})
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err);
});
