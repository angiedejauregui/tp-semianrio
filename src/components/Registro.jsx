import axios from 'axios';
import { useState } from 'react';

const Registro = ({ onRegister }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', form);
      onRegister(); // Avanza al login
    } catch (err) {
      alert('Error al registrar: ' + err.response.data.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="contrasena" type="password" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
