import React from 'react';

const HistorialSemana = ({ 
  semanaSeleccionada,
  historicalByWeek,
  semanaData,
  metaSemana,
  navegarSemana,
  formatearFechaCorta,
  formatearFechaCompleta
}) => {
  if (semanaSeleccionada === null) {
    return (
      <div className="mensaje-inicial">
        <p>Seleccioná una semana para ver tu progreso.</p>
        <p>Acá vas a encontrar tus métricas, acuerdos y evolución diaria.</p>
      </div>
    );
  }

  const tablaSemana = semanaData?.dias ?? [];

  return (
    <>
      <div className="semana-contenido">
        <ul className="metricas-resumen">
          <li>
            Llamadas realizadas: {semanaData.llamadas} / Meta: {metaSemana?.dailyCalls ?? "-"}
          </li>
          <li>
            Acuerdos logrados: {semanaData.acuerdos} / Meta: {metaSemana?.dailyAgreements ?? "-"}
          </li>
          <li className={`estado-meta ${semanaData.cumpleMeta ? 'cumplida' : 'no-cumplida'}`}>
            Meta: {semanaData.cumpleMeta ? 'Cumplida' : 'No cumplida'}
          </li>
        </ul>

        <table className="historial-tabla">
          <thead className="tabla-header">
            <tr>
              <th>Fecha</th>
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
                <td className="tabla-cell">{formatearFechaCompleta(d.fecha)}</td>
                <td className="tabla-cell">{d.dia}</td>
                <td className="tabla-cell">{d.llamadas}</td>
                <td className="tabla-cell">{d.contestadas}</td>
                <td className="tabla-cell">{d.acuerdos}</td>
                <td className="tabla-cell">{d.duracion} min</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Aquí irán los gráficos de la semana */}
        <div className="graficos-semana">
          {/* TODO: Agregar gráficos específicos para la semana */}
        </div>
      </div>
    </>
  );
};

export default HistorialSemana;