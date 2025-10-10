// Funciones utilitarias para el historial

export const formatearFechaCorta = (fecha) => {
  // Si la fecha viene en formato YYYY-MM-DD, la convertimos directamente
  if (fecha.includes('-')) {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }
  // Si viene en otro formato, usamos Date
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatearFechaCompleta = (fecha) => {
  // Si la fecha viene en formato YYYY-MM-DD, la convertimos directamente
  if (fecha.includes('-')) {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }
  // Si viene en otro formato, usamos Date
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

export const obtenerMesDeData = (semanaData) => {
  if (!semanaData.dias || semanaData.dias.length === 0) return '';
  const fecha = new Date(semanaData.dias[0].fecha);
  return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

export const obtenerTodosLosDias = (historicalByWeek) => {
  const todosLosDias = [];
  historicalByWeek.forEach(semana => {
    semana.dias.forEach(dia => {
      todosLosDias.push({ ...dia, semanaInfo: semana });
    });
  });
  return todosLosDias;
};

export const obtenerLimitesFechas = (historicalByWeek) => {
  if (!historicalByWeek || historicalByWeek.length === 0) {
    return { fechaMin: null, fechaMax: null };
  }

  let fechaMin = null;
  let fechaMax = null;

  historicalByWeek.forEach(semana => {
    semana.dias.forEach(dia => {
      const fecha = dia.fecha;
      if (!fechaMin || fecha < fechaMin) {
        fechaMin = fecha;
      }
      if (!fechaMax || fecha > fechaMax) {
        fechaMax = fecha;
      }
    });
  });

  return { fechaMin, fechaMax };
};