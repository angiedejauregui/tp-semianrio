import { useEffect, useState } from "react";
import './Historial.css';

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
    <div className="historial-container">
      <div className="historial-header">
        <h3 className={`historial-titulo ${semanaSeleccionada === null ? 'hidden' : ''}`}>
          Semana {semanaSeleccionada !== null ? semanaSeleccionada + 1 : ''}
        </h3>
        <div className="semana-selector">
          <button
            onClick={() => {
              if (tieneHistorial) setShowSemanas((prev) => !prev);
            }}
            className="semana-button"
            disabled={!tieneHistorial}
          >
            SEMANA
          </button>
          {showSemanas && tieneHistorial && (
            <div className="semana-dropdown">
              {historicalByWeek.map((_, idx) => (
                <div
                  key={idx}
                  className="semana-option"
                  onClick={() => handleSemanaClick(idx)}
                >
                  Semana {idx + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!userInfo || Object.keys(userInfo).length === 0 || !tieneHistorial ? (
        <div className="mensaje-inicial">
          <p>No hay historial cargado todavía.</p>
        </div>
      ) : semanaSeleccionada === null ? (
        <div className="mensaje-inicial">
          <p>Seleccioná una semana para ver tu progreso.</p>
          <p>Acá vas a encontrar tus métricas, acuerdos y evolución diaria.</p>
        </div>
      ) : (
        <div className="semana-contenido">
          <ul className="metricas-resumen">
            <li>
              Llamadas realizadas: {semanaData.llamadas} / Meta: {metaSemana?.dailyCalls ?? "-"}
            </li>
            <li>
              Acuerdos logrados: {semanaData.acuerdos} / Meta: {metaSemana?.dailyAgreements ?? "-"}
            </li>
          </ul>

          <table className="historial-tabla">
            <thead className="tabla-header">
              <tr>
                <th>Día</th>
                <th>Llamadas</th>
                <th>Contestadas</th>
                <th>Acuerdos</th>
                <th>Duración Prom.</th>
              </tr>
            </thead>
            <tbody className="tabla-body">
              {tablaSemana.map((d, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'fila-par' : 'fila-impar'}>
                  <td className="tabla-cell">{d.dia}</td>
                  <td className="tabla-cell">{d.llamadas}</td>
                  <td className="tabla-cell">{d.contestadas}</td>
                  <td className="tabla-cell">{d.acuerdos}</td>
                  <td className="tabla-cell">{d.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Historial;
