import { useState } from 'react';
import ModalConfirmacion from './ModalConfirmacion';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        setShowModal(true);
    };

    const handleConfirmLogout = () => {
        setShowModal(false);
        onLogout();
    };

    const handleCancelLogout = () => {
        setShowModal(false);
    };

return (
        <div className="sidebar">
        <div className="sidebar-header">
            <h2 className="sidebar-title">Estudio Palmero</h2>
            <h3 className="sidebar-menu-title">Menú</h3>
        </div>
        
        <div 
            onClick={() => setCurrentView("dashboard")}
            className={`sidebar-item ${currentView === "dashboard" ? "active" : ""}`}
        >
            Dashboard
        </div>
        
        <div 
            onClick={() => setCurrentView("historial")}
            className={`sidebar-item ${currentView === "historial" ? "active" : ""}`}
        >
            Historial
        </div>
        
        <div 
            onClick={handleLogout}
            className="sidebar-logout"
        >
            Cerrar sesión
        </div>

        <ModalConfirmacion
            open={showModal}
            onClose={handleCancelLogout}
            onConfirm={handleConfirmLogout}
            titulo="Cerrar sesión"
            mensaje="¿Estás seguro de que quieres cerrar sesión?"
        />
        </div>
    );
};

export default Sidebar;