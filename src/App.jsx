import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Historial from "./components/Historial";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "200px",
          background: "#333",
          color: "#fff",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid #555"
        }}>
          <h2 style={{ 
            margin: "0", 
            fontSize: "16px", 
            fontWeight: "bold"
          }}>
            Estudio Palmero
          </h2>
        </div>

        <h3>Menú</h3>
        <div
          style={{ 
            margin: "10px 0", 
            cursor: "pointer",
            padding: "8px 10px",
            backgroundColor: currentView === "dashboard" ? "#555" : "transparent",
            borderRadius: "4px",
            fontWeight: currentView === "dashboard" ? "bold" : "normal"
          }}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </div>
        <div
          style={{ 
            margin: "10px 0", 
            cursor: "pointer",
            padding: "8px 10px",
            backgroundColor: currentView === "historial" ? "#555" : "transparent",
            borderRadius: "4px",
            fontWeight: currentView === "historial" ? "bold" : "normal"
          }}
          onClick={() => setCurrentView("historial")}
        >
          Historial
        </div>
        <div
          style={{ margin: "10px 0", cursor: "pointer", padding: "8px 10px" }}
          onClick={() => alert("Salir")}
        >
          Salir
        </div>
      </div>


      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "historial" && <Historial />}
      </div>
    </div>
  );
}

export default App;
