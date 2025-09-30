import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './InicioSesion.css';

const InicioSesion = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.contrasena.trim()) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      toast.success('Inicio de sesión exitoso');
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="inicio-container">
      <div className="inicio-box">
        <div className="inicio-header">
          <h2 className="inicio-title">Bienvenido</h2>
          <p className="inicio-subtitle">Ingresá a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="inicio-form">
          <div className="inicio-form-group">
            <label className="inicio-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Ingrese su email"
              value={form.email}
              onChange={handleChange}
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
            Ingresar
          </button>
        </form>

        <div className="inicio-divider">
          <div className="inicio-divider-line"></div>
          <span className="inicio-divider-text">o</span>
        </div>

        <div className="inicio-register">
          <span>¿No tenés cuenta? </span>
          <button 
            type="button" 
            className="inicio-register-button" 
            onClick={onGoToRegister}
          >
            Registrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;