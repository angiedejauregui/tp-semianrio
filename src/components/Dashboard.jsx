import React, { useEffect, useState } from "react";
import debtors from "../data/debtors.json";

const goals = { dailyCalls: 20, agreements: 5 };
const PROCESS_INTERVAL_MS = 5000;

const Dashboard = () => {
  const [calls, setCalls] = useState(0);
  const [agreements, setAgreements] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const calculateProgress = (current, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Number(((current / goal) * 100).toFixed(1)));
  };

  useEffect(() => {
    const callsPct = calculateProgress(calls, goals.dailyCalls);
    const agreementsPct = calculateProgress(agreements, goals.agreements);
    console.log(
      `Progreso llamadas hoy: ${calls}/${goals.dailyCalls} (${callsPct}%)`
    );
    console.log(
      `Progreso acuerdos hoy: ${agreements}/${goals.agreements} (${agreementsPct}%)`
    );
  }, [calls, agreements]);

  useEffect(() => {
    if (currentIndex === 0) {
      console.log(
        `Iniciando lectura de ${debtors.length} deudor(es) en intervalos de ${
          PROCESS_INTERVAL_MS / 1000
        }s...`
      );
    }
    if (currentIndex >= debtors.length) {
      console.log(
        "Lectura finalizada. Total de deudores procesados:",
        debtors.length
      );
      return;
    }
    const timeout = setTimeout(() => {
      const d = debtors[currentIndex];
      console.log(
        `[Tick ${currentIndex + 1}] Promesa de pago registrada -> Nombre: ${
          d.name
        } | Monto: ${d.amount} | Tel: ${d.phone} | Motivo: ${d.reason}`
      );
      setAgreements((prev) => prev + 1);
      setCalls((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1);
    }, PROCESS_INTERVAL_MS);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const callsPct = calculateProgress(calls, goals.dailyCalls);
  const agreementsPct = calculateProgress(agreements, goals.agreements);

  return (
    <div>
      <h2>Dashboard (MVP)</h2>
      <ul>
        <li>Llamadas: {callsPct}%</li>
        <li>Acuerdos: {agreementsPct}%</li>
      </ul>
    </div>
  );
};

export default Dashboard;
