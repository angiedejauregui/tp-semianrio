import React, { useEffect, useState } from "react";
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import HistorialDia from './historial/HistorialDia';
import HistorialSemana from './historial/HistorialSemana';
import HistorialMes from './historial/HistorialMes';
import HistorialSelectors from './historial/HistorialSelectors';
import { formatearFechaCorta, formatearFechaCompleta, obtenerTodosLosDias, obtenerLimitesFechas } from './historial/historialUtils';
import './Historial.css';

const Historial = () => {
  const [showSemanas, setShowSemanas] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [vistaActual, setVistaActual] = useState('semana'); // 'dia', 'semana', 'mes'
  const [fechaBusqueda, setFechaBusqueda] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [showMeses, setShowMeses] = useState(false);
  const [datosVista, setDatosVista] = useState(null);
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [semanasFiltradasPorMes, setSemanasFiltradasPorMes] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
  const historicalByMonth = Array.isArray(historical.historicalByMonth)
    ? historical.historicalByMonth
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

  const mesData = mesSeleccionado !== null ? historicalByMonth[mesSeleccionado] : null;

  // Obtener límites de fechas para el selector
  const { fechaMin, fechaMax } = obtenerLimitesFechas(historicalByWeek);

  // Obtener años únicos para el filtro
  const aniosDisponibles = [...new Set(historicalByMonth.map(m => m.anio))].sort((a, b) => b - a);
  
  // Obtener meses únicos para el año seleccionado
  const mesesDisponibles = filtroAnio 
    ? historicalByMonth.filter(m => m.anio.toString() === filtroAnio)
    : historicalByMonth;

  // Filtrar semanas por mes/año si está seleccionado
  const semanasFiltradas = React.useMemo(() => {
    if (!filtroMes || !filtroAnio) return historicalByWeek;
    
    const mesSeleccionadoData = historicalByMonth.find(m => 
      m.mes === filtroMes && m.anio.toString() === filtroAnio
    );
    
    if (!mesSeleccionadoData) return [];
    
    // Obtener las semanas que pertenecen a ese mes
    const semanasDelMes = mesSeleccionadoData.semanas.map(s => s.semana);
    return historicalByWeek.filter(semana => semanasDelMes.includes(semana.semana));
  }, [filtroMes, filtroAnio, historicalByWeek, historicalByMonth]);

  const handleSemanaClick = (idx, esFiltradasPorMes = false) => {
    if (esFiltradasPorMes) {
      // Encontrar el índice real en el array completo
      const semanaData = semanasFiltradas[idx];
      const indiceReal = historicalByWeek.findIndex(s => s.semana === semanaData.semana);
      setSemanaSeleccionada(indiceReal);
    } else {
      setSemanaSeleccionada(idx);
    }
    setShowSemanas(false);
    setVistaActual('semana');
    setDatosVista(null);
  };

  const handleMesClick = (idx) => {
    setMesSeleccionado(idx);
    setShowMeses(false);
    setVistaActual('mes');
    setDatosVista(null);
  };

  const buscarPorFecha = () => {
    if (!fechaBusqueda) return;
    
    const fecha = new Date(fechaBusqueda);
    let diaEncontrado = null;
    let semanaEncontrada = null;

    // Buscar en todas las semanas y días
    for (let semana of historicalByWeek) {
      for (let dia of semana.dias) {
        if (dia.fecha === fechaBusqueda) {
          diaEncontrado = { ...dia, semanaInfo: semana };
          semanaEncontrada = semana;
          break;
        }
      }
      if (diaEncontrado) break;
    }

    if (diaEncontrado) {
      setVistaActual('dia');
      setDatosVista(diaEncontrado);
    } else {
      mostrarToast('No se encontraron datos para la fecha seleccionada');
    }
  };

  const cambiarVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    setSemanaSeleccionada(null);
    setMesSeleccionado(null);
    setDatosVista(null);
    setFechaBusqueda('');
    setFiltroMes('');
    setFiltroAnio('');
  };

  const mostrarToast = (mensaje) => {
    setToastMessage(mensaje);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleClickSeleccionarSemana = () => {
    if (!filtroMes || !filtroAnio) {
      mostrarToast('Por favor, seleccioná primero el mes y el año');
      return;
    }
    setShowSemanas((prev) => !prev);
  };



  const navegarSemana = (direccion) => {
    if (semanaSeleccionada === null) return;
    
    const nuevoIndice = semanaSeleccionada + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < historicalByWeek.length) {
      setSemanaSeleccionada(nuevoIndice);
    }
  };

  const navegarMes = (direccion) => {
    if (mesSeleccionado === null) return;
    
    const nuevoIndice = mesSeleccionado + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < historicalByMonth.length) {
      setMesSeleccionado(nuevoIndice);
    }
  };

  const navegarDia = (direccion) => {
    if (!datosVista) return;
    
    const todosLosDias = obtenerTodosLosDias(historicalByWeek);
    const indiceActual = todosLosDias.findIndex(dia => dia.fecha === datosVista.fecha);
    if (indiceActual === -1) return;
    
    const nuevoIndice = indiceActual + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < todosLosDias.length) {
      setDatosVista(todosLosDias[nuevoIndice]);
    }
  };

  return (
    <div className="historial-container">
      <div className="historial-header">
        <div className="vista-selector">
          <button 
            className={`vista-button ${vistaActual === 'dia' ? 'active' : ''}`}
            onClick={() => cambiarVista('dia')}
            disabled={!tieneHistorial}
          >
            DÍA
          </button>
          <button 
            className={`vista-button ${vistaActual === 'semana' ? 'active' : ''}`}
            onClick={() => cambiarVista('semana')}
            disabled={!tieneHistorial}
          >
            SEMANA
          </button>
          <button 
            className={`vista-button ${vistaActual === 'mes' ? 'active' : ''}`}
            onClick={() => cambiarVista('mes')}
            disabled={!tieneHistorial}
          >
            MES
          </button>
        </div>

        <div className="titulo-navegacion">
          <h3 className="historial-titulo">
            {vistaActual === 'dia' && datosVista && (
              <div className="titulo-con-navegacion">
                <button 
                  className="nav-button" 
                  onClick={() => navegarDia(-1)}
                  disabled={(() => {
                    const todosLosDias = obtenerTodosLosDias(historicalByWeek);
                    const indiceActual = todosLosDias.findIndex(dia => dia.fecha === datosVista.fecha);
                    return indiceActual === 0;
                  })()}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{datosVista.dia} - {formatearFechaCompleta(datosVista.fecha)}</span>
                <button 
                  className="nav-button" 
                  onClick={() => navegarDia(1)}
                  disabled={(() => {
                    const todosLosDias = obtenerTodosLosDias(historicalByWeek);
                    const indiceActual = todosLosDias.findIndex(dia => dia.fecha === datosVista.fecha);
                    return indiceActual === todosLosDias.length - 1;
                  })()}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {vistaActual === 'semana' && semanaSeleccionada !== null && (
              <div className="titulo-con-navegacion">
                <button 
                  className="nav-button" 
                  onClick={() => navegarSemana(-1)}
                  disabled={semanaSeleccionada === 0}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>Semana {semanaData.semana} ({formatearFechaCorta(semanaData.dias[0]?.fecha)} - {formatearFechaCorta(semanaData.dias[semanaData.dias.length - 1]?.fecha)})</span>
                <button 
                  className="nav-button" 
                  onClick={() => navegarSemana(1)}
                  disabled={semanaSeleccionada === historicalByWeek.length - 1}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {vistaActual === 'mes' && mesSeleccionado !== null && (
              <div className="titulo-con-navegacion">
                <button 
                  className="nav-button" 
                  onClick={() => navegarMes(-1)}
                  disabled={mesSeleccionado === 0}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{mesData.mes} {mesData.anio}</span>
                <button 
                  className="nav-button" 
                  onClick={() => navegarMes(1)}
                  disabled={mesSeleccionado === historicalByMonth.length - 1}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </h3>
        </div>

        <HistorialSelectors 
          vistaActual={vistaActual}
          fechaBusqueda={fechaBusqueda}
          setFechaBusqueda={setFechaBusqueda}
          buscarPorFecha={buscarPorFecha}
          filtroAnio={filtroAnio}
          setFiltroAnio={setFiltroAnio}
          filtroMes={filtroMes}
          setFiltroMes={setFiltroMes}
          setShowSemanas={setShowSemanas}
          showSemanas={showSemanas}
          handleClickSeleccionarSemana={handleClickSeleccionarSemana}
          semanasFiltradas={semanasFiltradas}
          handleSemanaClick={handleSemanaClick}
          formatearFechaCorta={formatearFechaCorta}
          showMeses={showMeses}
          setShowMeses={setShowMeses}
          historicalByMonth={historicalByMonth}
          handleMesClick={handleMesClick}
          aniosDisponibles={aniosDisponibles}
          mesesDisponibles={mesesDisponibles}
          tieneHistorial={tieneHistorial}
          historicalByWeek={historicalByWeek}
          fechaMin={fechaMin}
          fechaMax={fechaMax}
        />
      </div>

      {/* Toast de notificación */}
      {showToast && (
        <div className="toast">
          <div className="toast-content">
            <Info size={16} className="toast-icon" />
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}

      {!userInfo || Object.keys(userInfo).length === 0 || !tieneHistorial ? (
        <div className="mensaje-inicial">
          <p>No hay historial cargado todavía.</p>
        </div>
      ) : (
        <div className="contenido-historial">
          {vistaActual === 'dia' && (
            <HistorialDia 
              datosVista={datosVista}
              navegarDia={navegarDia}
              formatearFechaCompleta={formatearFechaCompleta}
              historicalByWeek={historicalByWeek}
              historical={userInfo.historical}
            />
          )}

          {vistaActual === 'semana' && (
            <HistorialSemana 
              semanaSeleccionada={semanaSeleccionada}
              historicalByWeek={historicalByWeek}
              semanaData={semanaData}
              metaSemana={metaSemana}
              navegarSemana={navegarSemana}
              formatearFechaCorta={formatearFechaCorta}
              formatearFechaCompleta={formatearFechaCompleta}
            />
          )}

          {vistaActual === 'mes' && (
            <HistorialMes 
              mesSeleccionado={mesSeleccionado}
              historicalByMonth={historicalByMonth}
              mesData={mesData}
              navegarMes={navegarMes}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Historial;
