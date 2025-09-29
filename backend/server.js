import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

mongoose.connect('mongodb://localhost:27017/Operadores', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
  app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));
}).catch(err => console.error(err));
