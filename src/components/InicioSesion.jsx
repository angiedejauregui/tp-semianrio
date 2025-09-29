import axios from 'axios';
import { useState } from 'react';

const InicioSesion = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      onLogin(); // Avanza al dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="contrasena" type="password" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} required />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <span>¿No tenés cuenta? </span>
        <button type="button" style={{ color: 'blue', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={onGoToRegister}>
          Registrate
        </button>
      </div>
    </div>
  );
};

export default InicioSesion;
