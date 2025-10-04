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
            <svg 
              className="user-icon" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
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