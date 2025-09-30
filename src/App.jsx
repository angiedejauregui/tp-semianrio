import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Historial from "./components/Historial";
import InicioSesion from "./components/InicioSesion";
import Registro from "./components/Registro";
import Sidebar from "./components/Sidebar";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login"); // "login" o "register"
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleRegister = () => setAuthMode("login"); // después de registrarse, ir a login

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setAuthMode("login");
  };

  if (!isLoggedIn) {
    if (authMode === "register") {
      return <Registro onRegister={handleRegister} />;
    }
    return <InicioSesion onLogin={handleLogin} onGoToRegister={() => setAuthMode("register")} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={handleLogout} 
      />
      <div style={{ flex: 1, padding: "20px" }}>
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "historial" && <Historial />}
      </div>
    </div>
  );
}

export default App;
