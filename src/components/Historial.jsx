import { useEffect, useState } from "react";

const Historial = () => {
  const [showSemanas, setShowSemanas] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);
  const { historical = {} } = userInfo || {};
  const { lastDay, historicalByWeek = [], goalsByWeek = [] } = historical || {};
  // Usar los datos reales por semana del usuario
  const semanaData = semanaSeleccionada !== null ? historicalByWeek[semanaSeleccionada] : null;
  const metaSemana = semanaData ? goalsByWeek.find(g => g.semana === semanaData.semana) : null;
  // Si el usuario tiene datos diarios por semana, usarlos para la tabla
  const tablaSemana = semanaData && semanaData.dias ? semanaData.dias : [];

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
              Llamadas realizadas semanal: {semanaData.llamadas} / Meta: {metaSemana?.dailyCalls ?? '-'}
            </li>
            <li>
              Acuerdos logrados semanal: {semanaData.acuerdos} / Meta: {metaSemana?.dailyAgreements ?? '-'}
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
