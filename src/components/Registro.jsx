import axios from 'axios';
import { useState } from 'react';
import './InicioSesion.css'; // Reutilizamos los mismos estilos

const Registro = ({ onRegister }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/users/register', form);
      onRegister(); // Avanza al login
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div className="inicio-container">
      <div className="inicio-box">
        <div className="inicio-header">
          <h2 className="inicio-title">Crear Cuenta</h2>
          <p className="inicio-subtitle">Completá tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="inicio-form">
          <div className="inicio-form-group">
            <label className="inicio-label">Nombre</label>
            <input
              name="nombre"
              type="text"
              placeholder="Ingrese su nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="inicio-input"
            />
          </div>

          <div className="inicio-form-group">
            <label className="inicio-label">Apellido</label>
            <input
              name="apellido"
              type="text"
              placeholder="Ingrese su apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="inicio-input"
            />
          </div>

          <div className="inicio-form-group">
            <label className="inicio-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Ingrese su email"
              value={form.email}
              onChange={handleChange}
              required
              className="inicio-input"
            />
          </div>

          <div className="inicio-form-group">
            <label className="inicio-label">Contraseña</label>
            <input
              name="contrasena"
              type="password"
              placeholder="Ingrese su contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
              className="inicio-input"
            />
          </div>

          {error && (
            <div className="inicio-error">
              <p className="inicio-error-text">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="inicio-button"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
