import React from 'react';
import { ChevronUp, ChevronDown, Phone, Handshake, Target } from 'lucide-react';

const HistorialSelectors = ({
  vistaActual,
  fechaBusqueda,
  setFechaBusqueda,
  buscarPorFecha,
  filtroAnio,
  setFiltroAnio,
  filtroMes,
  setFiltroMes,
  setShowSemanas,
  showSemanas,
  handleClickSeleccionarSemana,
  semanasFiltradas,
  handleSemanaClick,
  formatearFechaCorta,
  showMeses,
  setShowMeses,
  historicalByMonth,
  handleMesClick,
  aniosDisponibles,
  mesesDisponibles,
  tieneHistorial,
  historicalByWeek,
  fechaMin,
  fechaMax
}) => {
  return (
    <div className="selector-container">
      {vistaActual === 'dia' && (
        <div className="fecha-selector">
          <input 
            type="date" 
            value={fechaBusqueda}
            onChange={(e) => setFechaBusqueda(e.target.value)}
            className="fecha-input"
            min={fechaMin}
            max={fechaMax}
          />
          <button onClick={buscarPorFecha} className="buscar-button">
            BUSCAR
          </button>
        </div>
      )}

      {vistaActual === 'semana' && (
        <div className="semana-selector-container">
          <div className="filtros-semana">
            <select 
              value={filtroAnio} 
              onChange={(e) => {
                setFiltroAnio(e.target.value);
                setFiltroMes('');
                setShowSemanas(false);
              }}
              className="filtro-select"
            >
              <option value="">Seleccionar año</option>
              {aniosDisponibles.map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
            
            <select 
              value={filtroMes} 
              onChange={(e) => {
                setFiltroMes(e.target.value);
                setShowSemanas(false);
              }}
              className="filtro-select"
              disabled={!filtroAnio}
            >
              <option value="">Seleccionar mes</option>
              {filtroAnio && mesesDisponibles.map((mes, idx) => (
                <option key={idx} value={mes.mes}>{mes.mes}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleClickSeleccionarSemana}
            className={`semana-button ${(!filtroMes || !filtroAnio) ? 'disabled-warning' : ''}`}
            disabled={!tieneHistorial}
          >
            <span className="button-text">
              {filtroMes && filtroAnio ? `SEMANAS DE ${filtroMes} ${filtroAnio}` : 'SELECCIONAR SEMANA'}
            </span>
            <span className="dropdown-icon">
              {showSemanas ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          
          {showSemanas && tieneHistorial && filtroMes && filtroAnio && (
            <div className="semana-dropdown">
              {semanasFiltradas.map((semana, idx) => (
                <div
                  key={idx}
                  className="semana-option"
                  onClick={() => handleSemanaClick(idx, true)}
                >
                  <div className="semana-info">
                    <span className="semana-numero">Semana {semana.semana}</span>
                    <span className="semana-fechas">
                      {formatearFechaCorta(semana.dias[0]?.fecha)} - {formatearFechaCorta(semana.dias[semana.dias.length - 1]?.fecha)}
                    </span>
                    <span className={`semana-meta ${semana.cumpleMeta ? 'cumplida' : 'no-cumplida'}`}>
                      {semana.cumpleMeta ? 'SI' : 'NO'}
                    </span>
                  </div>
                </div>
              ))}
              {semanasFiltradas.length === 0 && (
                <div className="no-data-message">
                  No hay semanas disponibles para {filtroMes} {filtroAnio}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {vistaActual === 'mes' && (
        <div className="mes-selector">
          <button
            onClick={() => {
              if (tieneHistorial) setShowMeses((prev) => !prev);
            }}
            className="mes-button"
            disabled={!tieneHistorial}
          >
            <span className="button-text">SELECCIONAR MES</span>
            <span className="dropdown-icon">
              {showMeses ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>
          {showMeses && tieneHistorial && (
            <div className="mes-dropdown">
              {historicalByMonth.map((mes, idx) => {
                const totalLlamadas = mes.semanas.reduce((acc, s) => acc + s.llamadas, 0);
                const totalAcuerdos = mes.semanas.reduce((acc, s) => acc + s.acuerdos, 0);
                const semanasConMeta = mes.semanas.filter(s => s.cumpleMeta).length;
                
                return (
                  <div
                    key={idx}
                    className="mes-option"
                    onClick={() => handleMesClick(idx)}
                  >
                    <div className="mes-info">
                      <span className="mes-nombre">{mes.mes} {mes.anio}</span>
                      <div className="mes-stats">
                        <span><Phone size={14} /> {totalLlamadas}</span>
                        <span><Handshake size={14} /> {totalAcuerdos}</span>
                        <span><Target size={14} /> {semanasConMeta}/{mes.semanas.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistorialSelectors;