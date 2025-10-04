import { useEffect, useState } from "react";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [diarias, setDiarias] = useState(null);
  const [resumen, setResumen] = useState(null);
  const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const realizarLlamada = async () => {
    const llamada = {
      usuarioId: userData._id,
      duracion: Math.floor(Math.random() * 5) + 1,
      contestada: Math.random() < 0.8,
      acuerdo: Math.random() < 0.3
    };

    try {
      const res = await fetch("http://localhost:5000/llamadas/realizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(llamada)
      });

      if (res.ok) {
        await obtenerMetricasDiarias();
        await obtenerResumenSemanal();
      } else {
        console.error("Error al registrar la llamada");
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  const obtenerMetricasDiarias = async () => {
    try {
      const res = await fetch(`http://localhost:5000/llamadas/diarias/${userData._id}`);
      const data = await res.json();
      setDiarias(data.porDia?.[hoy] || null);
    } catch (err) {
      console.error("Error al obtener métricas diarias:", err);
    }
  };

  const obtenerResumenSemanal = async () => {
    try {
      const res = await fetch(`http://localhost:5000/llamadas/resumen/${userData._id}`);
      const data = await res.json();
      setResumen(data);
    } catch (err) {
      console.error("Error al obtener resumen semanal:", err);
    }
  };

  useEffect(() => {
    obtenerMetricasDiarias();
    obtenerResumenSemanal();
  }, [hoy]);

  // Metas por usuario
  const dailyCallsGoal = userData.goals?.dailyCalls ?? 20;
  const dailyAgreementsGoal = userData.goals?.dailyAgreements ?? 5;
  const weeklyCallsGoal = dailyCallsGoal * 5;
  const weeklyAgreementsGoal = dailyAgreementsGoal * 5;

  // Métricas diarias
  const dailyCalls = diarias?.llamadas ?? 0;
  const dailyAgreements = diarias?.acuerdos ?? 0;
  const dailyAnswered = diarias?.contestadas ?? 0;
  const dailyAvgDuration = diarias?.promedioDuracion ?? 0;
  const dailyContactRate = dailyCalls > 0 ? Math.round((dailyAnswered / dailyCalls) * 100) : 0;

  // Métricas acumuladas
  const totalCalls = resumen?.totalLlamadas ?? 0;
  const totalAgreements = resumen?.acuerdosCerrados ?? 0;

  return (
    <div>
      <h3>📅 Rendimiento Semanal</h3>
      <ul>
        <li>Llamadas realizadas: {totalCalls}/{weeklyCallsGoal}</li>
        <li>Acuerdos logrados: {totalAgreements}/{weeklyAgreementsGoal}</li>
      </ul>

      <h3>📈 Resumen Diario ({hoy})</h3>
      <ul>
        <li>Llamadas realizadas: {dailyCalls}</li>
        <li>Acuerdos logrados: {dailyAgreements}</li>
      </ul>

      <h3>📊 Indicadores</h3>
      <ul>
        <li>Tasa de contacto efectivo: {dailyContactRate}%</li>
        <li>Duración promedio de llamadas: {dailyAvgDuration} min</li>
      </ul>

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

export default Dashboard;
