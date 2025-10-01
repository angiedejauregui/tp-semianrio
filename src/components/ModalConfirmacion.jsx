import './ModalConfirmacion.css';

const ModalConfirmacion = ({ open, onClose, onConfirm, mensaje, titulo = "Confirmar acción" }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{titulo}</h3>
                <p className="modal-message">{mensaje}</p>
                <div className="modal-buttons">
                <button
                    className="modal-button cancel"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    className="modal-button confirm"
                    onClick={onConfirm}
                >
                    Cerrar sesión
                </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion;