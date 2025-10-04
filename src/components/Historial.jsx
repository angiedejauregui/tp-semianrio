import { useEffect, useState } from "react";

const Historial = () => {
  const [showSemanas, setShowSemanas] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const historical = userInfo?.historical ?? {};
  const historicalByWeek = Array.isArray(historical.historicalByWeek)
    ? historical.historicalByWeek
    : [];
  const goalsByWeek = Array.isArray(historical.goalsByWeek)
    ? historical.goalsByWeek
    : [];
  const tieneHistorial = historicalByWeek.length > 0 && goalsByWeek.length > 0;

  const semanaData =
    semanaSeleccionada !== null ? historicalByWeek[semanaSeleccionada] : null;
  const metaSemana = semanaData
    ? goalsByWeek.find((g) => g.semana === semanaData.semana)
    : null;
  const tablaSemana = semanaData?.dias ?? [];

  const handleSemanaClick = (idx) => {
    setSemanaSeleccionada(idx);
    setShowSemanas(false);
  };

  return (
    <div style={{ padding: "40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Encabezado fijo con botón arriba a la derecha */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h3
          style={
            semanaSeleccionada !== null
              ? semanaTitulo
              : { visibility: "hidden" }
          }
        >
          Semana {semanaSeleccionada + 1}
        </h3>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              if (tieneHistorial) setShowSemanas((prev) => !prev);
            }}
            style={{
              ...fechaBoton,
              backgroundColor: tieneHistorial ? "#7da7c0" : "#ccc",
              cursor: tieneHistorial ? "pointer" : "not-allowed",
            }}
            disabled={!tieneHistorial}
          >
            FECHA
          </button>
          {showSemanas && tieneHistorial && (
            <div style={dropdown}>
              {historicalByWeek.map((_, idx) => (
                <div
                  key={idx}
                  style={opcion}
                  onClick={() => handleSemanaClick(idx)}
                >
                  Semana {idx + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenido dependiendo del estado */}
      {!userInfo || Object.keys(userInfo).length === 0 || !tieneHistorial ? (
        <div style={mensajeInicial}>
          <p>No hay historial cargado todavía.</p>
          
        </div>
      ) : semanaSeleccionada === null ? (
        <div style={mensajeInicial}>
          <p>Seleccioná una semana para ver tu progreso.</p>
          <p>Acá vas a encontrar tus métricas, acuerdos y evolución diaria.</p>
        </div>
      ) : (
        <div>
          <ul style={metricasLista}>
            <li>
              Llamadas realizadas: {semanaData.llamadas} / Meta:{" "}
              {metaSemana?.dailyCalls ?? "-"}
            </li>
            <li>
              Acuerdos logrados: {semanaData.acuerdos} / Meta:{" "}
              {metaSemana?.dailyAgreements ?? "-"}
            </li>
          </ul>

          <table style={tablaEstilo}>
            <thead>
              <tr>
                <th style={thEstilo}>Día</th>
                <th style={thEstilo}>Llamadas</th>
                <th style={thEstilo}>Contestadas</th>
                <th style={thEstilo}>Acuerdos</th>
                <th style={thEstilo}>Duración</th>
              </tr>
            </thead>
            <tbody>
              {tablaSemana.map((d, idx) => (
                <tr key={idx} style={idx % 2 === 0 ? filaPar : filaImpar}>
                  <td style={tdEstilo}>{d.dia}</td>
                  <td style={tdEstilo}>{d.llamadas}</td>
                  <td style={tdEstilo}>{d.contestadas}</td>
                  <td style={tdEstilo}>{d.acuerdos}</td>
                  <td style={tdEstilo}>{d.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 🎨 Estilos visuales
const semanaTitulo = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#333",
  margin: 0,
};

const fechaBoton = {
  padding: "10px 18px",
  fontSize: "16px",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "background 0.3s",
};

const dropdown = {
  position: "absolute",
  top: "100%",
  right: 0,
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  zIndex: 10,
  minWidth: "160px",
  marginTop: "6px",
};

const opcion = {
  padding: "10px 14px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  fontSize: "15px",
};

const mensajeInicial = {
  marginTop: "80px",
  textAlign: "center",
  color: "#555",
  fontSize: "18px",
  fontStyle: "italic",
  lineHeight: "1.6",
};

const metricasLista = {
  listStyle: "none",
  paddingLeft: "0",
  fontSize: "16px",
  marginBottom: "20px",
};

const tablaEstilo = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  fontFamily: "Segoe UI, sans-serif",
  backgroundColor: "#fdfefe",
};

const thEstilo = {
  padding: "14px",
  backgroundColor: "#dbe9f4",
  color: "#333",
  fontWeight: "600",
  textAlign: "left",
  borderBottom: "1px solid #ccc",
};

const tdEstilo = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  textAlign: "left",
  fontSize: "15px",
  color: "#444",
};

const filaPar = {
  backgroundColor: "#f4f8fb",
};

const filaImpar = {
  backgroundColor: "#ffffff",
};

export default Historial;
