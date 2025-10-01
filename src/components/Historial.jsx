import { useState } from "react";
import { getCurrentUserData } from "../data/userData";

const Historial = () => {
  const [showSemanas, setShowSemanas] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);

  const userInfo = getCurrentUserData();
  const { historical = {}, goals = {} } = userInfo;
  const { lastDay, historicalByWeek = [] } = historical;
  // Usar los datos fijos por semana para la tabla, como antes
  const tablaPorSemana = [
    [
      { dia: 'Lunes', llamadas: 6, acuerdos: 2, contestadas: 4, duracion: 22.1 },
      { dia: 'Martes', llamadas: 7, acuerdos: 1, contestadas: 5, duracion: 21.5 },
      { dia: 'Miércoles', llamadas: 5, acuerdos: 2, contestadas: 3, duracion: 23.0 },
      { dia: 'Jueves', llamadas: 6, acuerdos: 1, contestadas: 4, duracion: 22.8 },
      { dia: 'Viernes', llamadas: 6, acuerdos: 1, contestadas: 4, duracion: 23.2 }
    ],
    [
      { dia: 'Lunes', llamadas: 5, acuerdos: 1, contestadas: 3, duracion: 20.1 },
      { dia: 'Martes', llamadas: 6, acuerdos: 2, contestadas: 4, duracion: 19.8 },
      { dia: 'Miércoles', llamadas: 5, acuerdos: 1, contestadas: 3, duracion: 20.5 },
      { dia: 'Jueves', llamadas: 4, acuerdos: 1, contestadas: 2, duracion: 20.0 },
      { dia: 'Viernes', llamadas: 5, acuerdos: 1, contestadas: 3, duracion: 20.2 }
    ],
    [
      { dia: 'Lunes', llamadas: 6, acuerdos: 2, contestadas: 4, duracion: 24.1 },
      { dia: 'Martes', llamadas: 7, acuerdos: 1, contestadas: 5, duracion: 24.5 },
      { dia: 'Miércoles', llamadas: 5, acuerdos: 2, contestadas: 3, duracion: 24.0 },
      { dia: 'Jueves', llamadas: 6, acuerdos: 1, contestadas: 4, duracion: 24.8 },
      { dia: 'Viernes', llamadas: 4, acuerdos: 0, contestadas: 2, duracion: 23.2 }
    ],
    [
      { dia: 'Lunes', llamadas: 7, acuerdos: 2, contestadas: 5, duracion: 23.1 },
      { dia: 'Martes', llamadas: 8, acuerdos: 2, contestadas: 6, duracion: 23.5 },
      { dia: 'Miércoles', llamadas: 6, acuerdos: 2, contestadas: 4, duracion: 23.0 },
      { dia: 'Jueves', llamadas: 6, acuerdos: 1, contestadas: 4, duracion: 23.8 },
      { dia: 'Viernes', llamadas: 5, acuerdos: 1, contestadas: 3, duracion: 23.2 }
    ]
  ];
  const semanaData = semanaSeleccionada !== null ? historicalByWeek[semanaSeleccionada] : null;
  const tablaSemana = semanaSeleccionada !== null ? tablaPorSemana[semanaSeleccionada] : [];

  const answeredRate =
    lastDay && lastDay.calls > 0
      ? ((lastDay.answeredCalls / lastDay.calls) * 100).toFixed(1)
      : 0;

  const handleSemanaClick = (idx) => {
    setSemanaSeleccionada(idx);
    setShowSemanas(false);
  };

  return (
    <div>
      <h2>Historial - {userInfo.nombre || userInfo.name || ""}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>{userInfo.email}</p>

      <div style={{ display: "flex", justifyContent: "center", margin: "30px 0" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <button onClick={() => setShowSemanas((prev) => !prev)}>
            FECHA {semanaSeleccionada !== null ? `- Semana ${semanaSeleccionada + 1}` : ""}
          </button>
          {showSemanas && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                border: "1px solid #ccc",
                zIndex: 10,
                minWidth: "120px",
                textAlign: "left",
              }}
            >
              {historicalByWeek.map((_, idx) => (
                <div
                  key={idx}
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => handleSemanaClick(idx)}
                >
                  Semana {idx + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {semanaData ? (
        <div>
          <h3>Métricas de la Semana {semanaData.semana}</h3>
          <ul>
            <li>
              Llamadas realizadas semanal: {semanaData.llamadas} / Meta: {goals.dailyCalls * 5}
            </li>
            <li>
              Acuerdos logrados semanal: {semanaData.acuerdos} / Meta: {goals.dailyAgreements * 5}
            </li>
          </ul>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Día</th>
                <th style={thStyle}>Llamadas realizadas</th>
                <th style={thStyle}>Llamadas contestadas</th>
                <th style={thStyle}>Acuerdo</th>
                <th style={thStyle}>Duración promedio</th>
              </tr>
            </thead>
            <tbody>
              {tablaSemana.map((d, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{d.dia}</td>
                  <td style={tdStyle}>{d.llamadas}</td>
                  <td style={tdStyle}>{d.contestadas}</td>
                  <td style={tdStyle}>{d.acuerdos}</td>
                  <td style={tdStyle}>{d.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3>Métricas de Hoy</h3>
          <ul>
            <li>Llamadas realizadas hoy: {lastDay?.calls || 0}</li>
            <li>Acuerdos logrados hoy: {lastDay?.agreements || 0}</li>
            <li>Porcentaje de llamadas contestadas: {answeredRate}%</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f5f5f5",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default Historial;
