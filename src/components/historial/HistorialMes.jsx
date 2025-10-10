import React from 'react';

const HistorialMes = ({ 
  mesSeleccionado,
  historicalByMonth,
  mesData,
  navegarMes
}) => {
  if (mesSeleccionado === null) {
    return (
      <div className="mensaje-inicial">
        <p>Seleccioná un mes para ver el resumen mensual.</p>
        <p>Verás las métricas por semana y el cumplimiento de metas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mes-contenido">
        <div className="resumen-mensual">
          <h4>Resumen del Mes</h4>
          <div className="metricas-mes">
            <div className="metrica-card">
              <h5>Total Llamadas</h5>
              <p className="valor">{mesData.semanas.reduce((acc, s) => acc + s.llamadas, 0)}</p>
            </div>
            <div className="metrica-card">
              <h5>Total Acuerdos</h5>
              <p className="valor">{mesData.semanas.reduce((acc, s) => acc + s.acuerdos, 0)}</p>
            </div>
            <div className="metrica-card">
              <h5>Semanas con Meta</h5>
              <p className="valor">{mesData.semanas.filter(s => s.cumpleMeta).length}/{mesData.semanas.length}</p>
            </div>
          </div>
        </div>

        <table className="historial-tabla">
          <thead className="tabla-header">
            <tr>
              <th>Semana</th>
              <th>Llamadas</th>
              <th>Contestadas</th>
              <th>Acuerdos</th>
              <th>Duración Prom.</th>
              <th>Meta</th>
            </tr>
          </thead>
          <tbody className="tabla-body">
            {mesData.semanas.map((semana, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'fila-par' : 'fila-impar'}>
                <td className="tabla-cell">Semana {semana.semana}</td>
                <td className="tabla-cell">{semana.llamadas}</td>
                <td className="tabla-cell">{semana.contestadas}</td>
                <td className="tabla-cell">{semana.acuerdos}</td>
                <td className="tabla-cell">{semana.duracionPromedio} min</td>
                <td className="tabla-cell">
                  <span className={`badge ${semana.cumpleMeta ? 'cumplida' : 'no-cumplida'}`}>
                    {semana.cumpleMeta ? 'SI' : 'NO'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Aquí irán los gráficos del mes */}
        <div className="graficos-mes">
          {/* TODO: Agregar gráficos específicos para el mes */}
        </div>
      </div>
    </>
  );
};

export default HistorialMes;