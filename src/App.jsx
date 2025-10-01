import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import Dashboard from "./components/Dashboard";
import Historial from "./components/Historial";
import InicioSesion from "./components/InicioSesion";
import Registro from "./components/Registro";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login"); // "login" o "register"
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleRegister = () => setAuthMode("login"); // después de registrarse, ir a login

  if (!isLoggedIn) {
    if (authMode === "register") {
      return <Registro onRegister={handleRegister} />;
    }
    // Pantalla inicial: solo login, con link a registro
    return <InicioSesion onLogin={handleLogin} onGoToRegister={() => setAuthMode("register")} />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", background: "#333", color: "#fff", padding: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Estudio Palmero</h2>
          <h3>Menú</h3>
          <div onClick={() => setCurrentView("dashboard")}>Dashboard</div>
          <div onClick={() => setCurrentView("historial")}>Historial</div>
          <div onClick={() => {
            localStorage.removeItem("userData");
            setIsLoggedIn(false);
            setAuthMode("select");
          }}>Salir</div>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "historial" && <Historial />}
        </div>
      </div>
    </>
  );
}

const btn = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer"
};

export default App;
