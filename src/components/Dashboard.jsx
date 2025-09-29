import { useState } from "react";
import { currentUser, getCurrentUserData, updateUserData } from "../data/userData";

const Dashboard = () => {
  const userInfo = getCurrentUserData();
  const [calls, setCalls] = useState(userInfo.currentDay.calls);
  const [agreements, setAgreements] = useState(userInfo.currentDay.agreements);
  const [totalCalls, setTotalCalls] = useState(userInfo.currentDay.totalCalls);
  const [totalAgreements, setTotalAgreements] = useState(userInfo.currentDay.totalAgreements);
  const [answeredCalls, setAnsweredCalls] = useState(userInfo.currentDay.answeredCalls);
  const [callDurations, setCallDurations] = useState(userInfo.currentDay.callDurations);

  const simulateCall = () => {
    const wasAnswered = Math.random() < 0.7; // 70% chance de que contesten
    const duration = wasAnswered ? Math.random() * 10 + 20 : 0; // entre 20 y 30 minutos si contestaron
    const closedAgreement = wasAnswered && Math.random() < 0.3; // 30% chance de cerrar acuerdo

    const newCalls = calls + 1;
    const newTotalCalls = totalCalls + 1;
    let newAgreements = agreements;
    let newTotalAgreements = totalAgreements;
    let newAnsweredCalls = answeredCalls;
    let newCallDurations = [...callDurations];

    setCalls(newCalls);
    setTotalCalls(newTotalCalls);

    if (wasAnswered) {
      newAnsweredCalls = answeredCalls + 1;
      setAnsweredCalls(newAnsweredCalls);
      newCallDurations = [...callDurations, duration];
      setCallDurations(newCallDurations);
    }

    if (closedAgreement) {
      newAgreements = agreements + 1;
      newTotalAgreements = totalAgreements + 1;
      setAgreements(newAgreements);
      setTotalAgreements(newTotalAgreements);
    }

    // Actualizar datos del usuario
    updateUserData(currentUser, {
      currentDay: {
        calls: newCalls,
        agreements: newAgreements,
        totalCalls: newTotalCalls,
        totalAgreements: newTotalAgreements,
        answeredCalls: newAnsweredCalls,
        callDurations: newCallDurations,
      }
    });
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
      <h2>Dashboard - {userInfo.name}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>{userInfo.email}</p>
      <h3>Métricas de Hoy</h3>
      <ul>
        <li>
          Llamadas realizadas: {calls}/{userInfo.goals.dailyCalls}
        </li>
        <li>
          Acuerdos logrados: {agreements}/{userInfo.goals.agreements}
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
