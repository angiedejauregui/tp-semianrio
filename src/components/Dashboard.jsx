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

  // Mock daily metrics for demo (replace with real daily data if available)
  const dailyCalls = metricas?.llamadasHoy ?? 0;
  const dailyAgreements = metricas?.acuerdosHoy ?? 0;
  const dailyCallsGoal = userData.goals?.dailyCalls ?? 20;
  const dailyAgreementsGoal = userData.goals?.dailyAgreements ?? 5;
  const totalCalls = metricas?.total ?? 0;
  const totalAgreements = metricas?.acuerdos ?? 0;
  const totalAnswered = metricas?.contestadas ?? 0;
  const totalAvgDuration = metricas?.promedioDuracion ?? 0;
  const diasSemana = 5;
  const totalCallsGoal = dailyCallsGoal * diasSemana;
  const totalAgreementsGoal = dailyAgreementsGoal * diasSemana;
  // Calcular días restantes (puedes ajustar según tu lógica real)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=domingo, 1=lunes...
  const diasRestantes = Math.max(0, diasSemana - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  // Calculate % answered
  const percentAnswered = totalCalls > 0 ? Math.round((totalAnswered / totalCalls) * 100) : 0;
  // Progreso llamadas y acuerdos
  const progresoLlamadas = Math.round((totalCalls / totalCallsGoal) * 100);
  const progresoAcuerdos = Math.round((totalAgreements / totalAgreementsGoal) * 100);

  return (
    <div>
      <h2>Dashboard - {userData.name}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>{userData.email}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Progreso Diario</h3>
        <ul>
          <li>Llamadas realizadas: {dailyCalls}/{dailyCallsGoal}</li>
          <li>Acuerdos logrados: {dailyAgreements}/{dailyAgreementsGoal}</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Historial Acumulado</h3>
        <ul>
          <li>
            <strong>Llamadas realizadas:</strong> {totalCalls}/{totalCallsGoal}
          </li>
        </ul>
        <ul>
          <li>
            <span style={{color: totalCalls >= totalCallsGoal ? 'green' : 'red'}}>
              {totalCalls >= totalCallsGoal
                ? '✅ Meta semanal cumplida'
                : '❌ Meta semanal no cumplida'}
            </span>
          </li>
          <li>
            <strong>Acuerdos alcanzados:</strong> {totalAgreements}/{totalAgreementsGoal}
          </li>
          <li>
            <span style={{color: totalAgreements >= totalAgreementsGoal ? 'green' : 'red'}}>
              {totalAgreements >= totalAgreementsGoal
                ? '✅ Meta semanal cumplida'
                : '❌ Meta semanal no cumplida'}
            </span>
          </li>
          <li>
            <strong>Llamadas contestadas:</strong> {percentAnswered}%
          </li>
          <li>
            <strong>Duración promedio de llamada:</strong> {totalAvgDuration} min
          </li>
        </ul>
      </div>

      <button onClick={realizarLlamada} style={btn}>Simular llamada</button>
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
