import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './InicioSesion.css';

const InicioSesion = ({ onLogin, onGoToRegister }) => {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      localStorage.removeItem('userData');
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      if (res.status === 200 && res.data?.user && !res.data.error) {
        localStorage.setItem('userData', JSON.stringify(res.data.user));
        toast.success('Inicio de sesión exitoso');
        onLogin();
      } else {
        localStorage.removeItem('userData');
        setError(res.data.error || 'Credenciales incorrectas');
        toast.error(res.data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      localStorage.removeItem('userData');
      setError(err.response?.data?.error || 'Credenciales incorrectas');
      toast.error(err.response?.data?.error || 'Credenciales incorrectas');
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

          <div className="inicio-form-group" style={{ position: 'relative' }}>
            <label className="inicio-label">Contraseña</label>
            <input
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="inicio-input"
              style={{ paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-0%)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>

          {error && (
            <div className="inicio-error">
              <p className="inicio-error-text">{error}</p>
            </div>
          )}

          <button type="submit" className="inicio-button">
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
