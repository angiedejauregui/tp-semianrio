import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import './InicioSesion.css'; // Reutilizamos los mismos estilos

const Registro = ({ onRegister, onGoToLogin }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.email.trim() ||
      !form.contrasena.trim()
    ) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/register', form);

      setForm({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: ''
      });

      toast.success('¡Registro exitoso! Ahora puede iniciar sesión');

      setTimeout(() => {
        onRegister(); // Avanza al login
      }, 1500);
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
              className="inicio-input"
            />
          </div>

          {/* Campo de contraseña con ícono 👁️ */}
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
            Registrarse
          </button>
        </form>

        <div className="inicio-footer">
          <p className="inicio-footer-text">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="inicio-link-button"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
