import { useEffect, useState } from "react";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [metricas, setMetricas] = useState(null);
  const [resumen, setResumen] = useState(null);

  const realizarLlamada = async () => {
    const llamada = {
      usuarioId: userData._id,
      duracion: Math.floor(Math.random() * 5) + 1,
      contestada: Math.random() < 0.8,
      acuerdo: Math.random() < 0.3
    };

    await fetch("http://localhost:5000/llamadas/realizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(llamada)
    });

    obtenerMetricas();
    obtenerResumen();
  };

  const obtenerMetricas = async () => {
    const res = await fetch(`http://localhost:5000/llamadas/metricas/${userData._id}`);
    const data = await res.json();
    setMetricas(data);
  };

  const obtenerResumen = async () => {
    const res = await fetch(`http://localhost:5000/llamadas/resumen/${userData._id}`);
    const data = await res.json();
    setResumen(data);
  };

  useEffect(() => {
    obtenerMetricas();
    obtenerResumen();
  }, []);

  return (
    <div>
      <h2>Dashboard - {userData.name}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>{userData.email}</p>

      <button onClick={realizarLlamada} style={btn}>Simular llamada</button>

      {metricas && (
        <div style={{ marginTop: "20px" }}>
          <h3>Métricas Totales</h3>
          <ul>
            <li>Llamadas realizadas: {metricas.total}</li>
            <li>Contestadas: {metricas.contestadas}</li>
            <li>Acuerdos: {metricas.acuerdos}</li>
            <li>Promedio duración: {metricas.promedioDuracion} min</li>
          </ul>
        </div>
      )}

      {resumen && (
        <div style={{ marginTop: "30px" }}>
          <h3>Resumen general</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Total llamadas</th>
                <th style={th}>Contestadas</th>
                <th style={th}>Acuerdos</th>
                <th style={th}>Duración total</th>
                <th style={th}>Promedio duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>{resumen.totalLlamadas}</td>
                <td style={td}>{resumen.llamadasContestadas}</td>
                <td style={td}>{resumen.acuerdosCerrados}</td>
                <td style={td}>{resumen.duracionTotal}</td>
                <td style={td}>{parseFloat(resumen.promedioDuracion).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const btn = {
  marginTop: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer"
};

const th = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f5f5f5",
  textAlign: "left"
};

const td = {
  border: "1px solid #ccc",
  padding: "8px"
};

export default Dashboard;
