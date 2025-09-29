import React from "react";
import { getCurrentUserData } from "../data/userData";

const Historial = () => {
    const userInfo = getCurrentUserData();
    const { lastDay } = userInfo.historical;

    const answeredRate = lastDay.calls > 0 ? ((lastDay.answeredCalls / lastDay.calls) * 100).toFixed(1) : 0;

    return (
        <div>
        <h2>Historial - {userInfo.name}</h2>
        <p style={{ color: "#666", fontSize: "14px" }}>{userInfo.email}</p>
        <h3>Métricas de Días Anteriores</h3>
        <ul>
            <li>
            Llamadas realizadas: {lastDay.calls}/{userInfo.goals.dailyCalls}
            </li>
            <li>
            Acuerdos logrados: {lastDay.agreements}/{userInfo.goals.agreements}
            </li>
        </ul>
        <h3>Métricas Totales de Días Anteriores</h3>
        <ul>
            <li>Llamadas realizadas: {lastDay.totalCalls}</li>
            <li>Acuerdos alcanzados: {lastDay.totalAgreements}</li>
            <li>Llamadas contestadas: {answeredRate}%</li>
            <li>Duración promedio de llamada: {lastDay.avgDuration} min</li>
        </ul>
        </div>
    );
};

export default Historial;
