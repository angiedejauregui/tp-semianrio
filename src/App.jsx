import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Historial from "./components/Historial";
import InicioSesion from "./components/InicioSesion";
import Registro from "./components/Registro";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
    setIsLoggedIn(true);
  };
  
  const handleRegister = () => setAuthMode("login");
  
  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    setIsLoggedIn(false);
    setAuthMode("login");
  };

  // Verificar si ya existe una sesión al cargar la aplicación
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    if (authMode === "register") {
      return <Registro onRegister={handleRegister} onGoToLogin={() => setAuthMode("login")} />;
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header usuario={userData} currentView={currentView} />
        <div style={{ flex: 1, padding: "10px 20px", overflow: "auto" }}>
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "historial" && <Historial />}
        </div>
      </div>
    </div>
  );
}

export default App;
