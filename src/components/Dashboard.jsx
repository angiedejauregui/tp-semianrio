import React, { useState } from "react";

const goals = {
  dailyCalls: 20,
  agreements: 5,
};

const Dashboard = () => {
  const [calls, setCalls] = useState(0);
  const [agreements, setAgreements] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalAgreements, setTotalAgreements] = useState(0);
  const [answeredCalls, setAnsweredCalls] = useState(0);
  const [callDurations, setCallDurations] = useState([]);

  const simulateCall = () => {
    const wasAnswered = Math.random() < 0.7; // 70% chance de que contesten
    const duration = wasAnswered ? Math.random() * 5 + 1 : 0; // entre 1 y 6 minutos si contestaron
    const closedAgreement = wasAnswered && Math.random() < 0.3; // 30% chance de cerrar acuerdo

    setCalls((prev) => prev + 1);
    setTotalCalls((prev) => prev + 1);

    if (wasAnswered) {
      setAnsweredCalls((prev) => prev + 1);
      setCallDurations((prev) => [...prev, duration]);
    }

    if (closedAgreement) {
      setAgreements((prev) => prev + 1);
      setTotalAgreements((prev) => prev + 1);
    }
  };

  const answeredRate =
    calls > 0 ? ((answeredCalls / calls) * 100).toFixed(1) : 0;

  const avgDuration =
    callDurations.length > 0
      ? (
          callDurations.reduce((a, b) => a + b, 0) / callDurations.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      <h2>Resumen de Actividad</h2>
      <h3>Métricas de Hoy</h3>
      <ul>
        <li>
          Llamadas realizadas: {calls}/{goals.dailyCalls}
        </li>
        <li>
          Acuerdos logrados: {agreements}/{goals.agreements}
        </li>
      </ul>
      <h3>Métricas Totales</h3>
      <ul>
        <li>Llamadas realizadas: {totalCalls}</li>
        <li>Acuerdos alcanzados: {totalAgreements}</li>
        <li>Llamadas contestadas: {answeredRate}%</li>
        <li>Duración promedio de llamada: {avgDuration} min</li>
      </ul>
      <button onClick={simulateCall}>Simular llamada</button>
    </div>
  );
};

export default Dashboard;
