import React, { useState } from "react";

const goals = {
  daily: 20,
  weekly: 100,
  monthly: 400,
};

const Dashboard = () => {
  const [progress, setProgress] = useState({ daily: 0, weekly: 0, monthly: 0 });

  const incrementar = () => {
    setProgress((prev) => ({
      daily: prev.daily + 1,
      weekly: prev.weekly + 1,
      monthly: prev.monthly + 1,
    }));
  };

  return (
    <>
      <h2>Metas</h2>
      <ul>
        <li>
          Diario {progress.daily}/{goals.daily}
        </li>
        <li>
          Semanal {progress.weekly}/{goals.weekly}
        </li>
        <li>
          Mensual {progress.monthly}/{goals.monthly}
        </li>
      </ul>
      <button onClick={() => incrementar()}>incrementar</button>
    </>
  );
};

export default Dashboard;
