import { CircleUserRound } from 'lucide-react';
import './Header.css';

const Header = ({ usuario, currentView }) => {
  const getTitulo = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Mi Dashboard';
      case 'historial':
        return 'Mi Historial';
      default:
        return 'Mi Dashboard';
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        {/* Título del lado izquierdo */}
        <div className="header-title">
          <h1>{getTitulo()}</h1>
        </div>
        
        {/* Información del usuario del lado derecho */}
        <div className="header-user">
          <div className="user-avatar">
            <CircleUserRound size={42} strokeWidth={1.5} className="user-icon" />
          </div>
          <div className="user-info">
            <div className="user-name">
              {usuario?.nombre} {usuario?.apellido}
            </div>
            <div className="user-email">
              {usuario?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;