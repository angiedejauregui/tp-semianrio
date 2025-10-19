import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const HistorialMes = ({ mesSeleccionado, historicalByMonth = [], mesData: mesDataProp, goalsByWeek = [], historicalByWeek = [] }) => {
  // accept 0 as valid index
  if (mesSeleccionado == null && !mesDataProp) return (
  <div className="mensaje-inicial">
    <p>Seleccioná un mes para ver el resumen mensual.</p>
  </div>
);


  const mesData = mesDataProp || (
    mesSeleccionado != null && typeof mesSeleccionado === 'number' ? (historicalByMonth[mesSeleccionado] || null) : (
      typeof mesSeleccionado === 'string' ? historicalByMonth.find(m => (m.mes || '').toString().toLowerCase() === mesSeleccionado.toString().toLowerCase()) : null
    )
  );

  if (!mesData) return <p>No hay datos para {String(mesSeleccionado)}</p>;

  const parseDateSafe = (fechaStr) => {
    if (!fechaStr) return null;
    const isoDateOnly = fechaStr.match(/^\d{4}-\d{2}-\d{2}$/);
    if (isoDateOnly) {
      const [y, m, day] = fechaStr.split('-').map(Number);
      return new Date(y, m - 1, day);
    }
    const dt = new Date(fechaStr);
    return isNaN(dt) ? null : dt;
  };

  const days = useMemo(() => {
    const rows = [];
    const semanas = mesData.semanas || [];
    const hasDias = semanas.some(s => Array.isArray(s.dias) && s.dias.length > 0);
    if (hasDias) {
      semanas.forEach(s => (s.dias || []).forEach(d => rows.push(Object.assign({}, d, { semana: s.semana }))));
    } else {
      const monthName = (mesData.mes || '').toString().toLowerCase();
      const year = mesData.anio != null ? Number(mesData.anio) : null;
      const monthMap = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
      const targetMonth = monthMap[monthName];
      if (typeof targetMonth === 'number') {
        (historicalByWeek || []).forEach(w => (w.dias || []).forEach(d => {
          if (!d || !d.fecha) return;
          const dt = parseDateSafe(d.fecha);
          if (!dt) return;
          if (dt.getMonth() === targetMonth && (year == null || dt.getFullYear() === year)) rows.push(Object.assign({}, d, { semana: w.semana }));
        }));
      }
    }

    const map = new Map();
    rows.forEach(r => {
      if (!r) return;
      const key = r.fecha || JSON.stringify(r);
      if (!map.has(key)) map.set(key, r);
    });

    const deduped = Array.from(map.values()).sort((a, b) => {
      const da = parseDateSafe(a.fecha);
      const db = parseDateSafe(b.fecha);
      if (da && db) return da - db;
      return 0;
    });

    return deduped.map(d => ({
      dia: d.dia,
      fecha: d.fecha,
      semana: d.semana,
      llamadas: d.llamadas ?? d.llamadas_realizadas ?? d.realizadas ?? 0,
      acuerdos: d.acuerdos ?? d.acuerdos_logrados ?? 0,
      contestadas: d.contestadas ?? 0,
      duracion: d.duracion ?? d.duracionPromedio ?? 0,
    }));
  }, [mesData, historicalByWeek]);

  const chartData = useMemo(() => {
    // Build weekly aggregates. Prefer mesData.semanas when available.
    const semanasSource = Array.isArray(mesData.semanas) && mesData.semanas.length ? mesData.semanas : null;

    let semanas = [];
    if (semanasSource) {
      semanas = semanasSource.map(s => ({ ...s }));
    } else {
      // Group days by semana as fallback
      const map = new Map();
      days.forEach(d => {
        const sem = d.semana ?? '0';
        if (!map.has(sem)) map.set(sem, { semana: sem, dias: [] });
        map.get(sem).dias.push(d);
      });
      semanas = Array.from(map.values()).sort((a, b) => Number(a.semana) - Number(b.semana));
    }

    const labels = semanas.map((s, idx) => `Semana ${idx + 1}`);

    const semanaNums = semanas.map(s => s.semana);
    const daysCountPerSemana = semanas.map(s => Array.isArray(s.dias) ? s.dias.length : ((historicalByWeek.find(w => w.semana === s.semana)?.dias?.length) || 5));

    const llamadas = semanas.map(s => {
      if (s.llamadas != null) return s.llamadas;
      if (Array.isArray(s.dias)) return s.dias.reduce((sum, d) => sum + (d.llamadas || 0), 0);
      return 0;
    });

    const acuerdos = semanas.map(s => {
      if (s.acuerdos != null) return s.acuerdos;
      if (Array.isArray(s.dias)) return s.dias.reduce((sum, d) => sum + (d.acuerdos || 0), 0);
      return 0;
    });

    return { labels, llamadas, acuerdos, semanaNums, daysCountPerSemana, semanas };
  }, [mesData, days, historicalByWeek]);

  // Build per-week goal series aligned with semanas (arrays computed from chartData)
  const perWeekGoalCalls = (() => {
    const semanaNums = chartData.semanaNums || [];
    return semanaNums.map((sem, idx) => {
      const g = (goalsByWeek || []).find(x => String(x.semana) === String(sem)) || {};
      let weeklyTotal = 0;
      if (g.weeklyCalls != null) weeklyTotal = g.weeklyCalls;
      else if (g.totalCalls != null) weeklyTotal = g.totalCalls;
      else if (g.dailyCalls != null) {
        // Treat provided dailyCalls as the weekly target (do not multiply) to avoid over-counting
        weeklyTotal = g.dailyCalls;
      } else if (g.llamadas != null) weeklyTotal = g.llamadas;
      return weeklyTotal;
    });
  })();

  const perWeekGoalAg = (() => {
    const semanaNums = chartData.semanaNums || [];
    return semanaNums.map((sem, idx) => {
      const g = (goalsByWeek || []).find(x => String(x.semana) === String(sem)) || {};
      let weeklyTotal = 0;
      if (g.weeklyAgreements != null) weeklyTotal = g.weeklyAgreements;
      else if (g.totalAgreements != null) weeklyTotal = g.totalAgreements;
      else if (g.dailyAgreements != null) {
        // Treat provided dailyAgreements as the weekly target (do not multiply)
        weeklyTotal = g.dailyAgreements;
      } else if (g.acuerdos != null) weeklyTotal = g.acuerdos;
      return weeklyTotal;
    });
  })();

  const totals = useMemo(() => {
    const semanas = mesData.semanas || [];
    const totalCalls = semanas.reduce((s, w) => s + (w.llamadas ?? w.totalLlamadas ?? 0), 0) || chartData.llamadas.reduce((s, v) => s + v, 0);
    const totalAg = semanas.reduce((s, w) => s + (w.acuerdos ?? 0), 0) || chartData.acuerdos.reduce((s, v) => s + v, 0);
    const contestadas = semanas.reduce((s, w) => s + (w.contestadas ?? 0), 0) || days.reduce((s, d) => s + (d.contestadas || 0), 0);
    const avgContact = totalCalls ? Math.round((contestadas / Math.max(totalCalls, 1)) * 100 * 10) / 10 : 0;
    const avgDur = semanas.length ? (semanas.reduce((s, w) => s + (w.duracionPromedio ?? 0), 0) / semanas.length) : (days.length ? (days.reduce((s, d) => s + (d.duracion || 0), 0) / days.length) : 0);
    const monthGoalCalls = perWeekGoalCalls.reduce((s, v) => s + (v || 0), 0);
    const monthGoalAgreements = perWeekGoalAg.reduce((s, v) => s + (v || 0), 0);
    return { totalCalls, totalAg, avgContact, avgDur, monthGoalCalls, monthGoalAgreements };
  }, [mesData, chartData, days, perWeekGoalCalls, perWeekGoalAg]);

  // Trend lines removed per user request; charts will show only bars (real vs meta semanal)

  const baseOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    animation: { duration: 800, easing: 'easeOutQuart' },
  };

  const llamadasDataset = {
    labels: chartData.labels,
    datasets: [
      { type: 'bar', label: 'Llamadas (real)', data: chartData.llamadas, backgroundColor: '#5dade2' },
    ],
  };
  if (perWeekGoalCalls.some(v => v > 0)) {
    llamadasDataset.datasets.push({ type: 'bar', label: 'Meta (semana) - Llamadas', data: perWeekGoalCalls, backgroundColor: '#2ecc71' });
  }

  const acuerdosDataset = {
    labels: chartData.labels,
    datasets: [
      { type: 'bar', label: 'Acuerdos (real)', data: chartData.acuerdos, backgroundColor: '#10b981' },
    ],
  };
  if (perWeekGoalAg.some(v => v > 0)) {
    acuerdosDataset.datasets.push({ type: 'bar', label: 'Meta (semana) - Acuerdos', data: perWeekGoalAg, backgroundColor: '#117a65' });
  }
  // no trend datasets

  // We display only per-week goals (bars) to avoid confusion from per-day distributions

  // compute achieved weeks to show X/Y
  const achievedWeeks = (chartData.semanas || []).map((s, idx) => {
    const actualCalls = Number(s.llamadas ?? chartData.llamadas?.[idx] ?? 0);
    const actualAg = Number(s.acuerdos ?? chartData.acuerdos?.[idx] ?? 0);
    const goalCalls = Number(perWeekGoalCalls?.[idx] ?? 0);
    const goalAg = Number(perWeekGoalAg?.[idx] ?? 0);
    const callsMet = goalCalls > 0 ? actualCalls >= goalCalls : null;
    const agMet = goalAg > 0 ? actualAg >= goalAg : null;
    if (callsMet === null && agMet === null) return null;
    if (callsMet !== null && agMet !== null) return (callsMet && agMet) ? s.semana : null;
    if (callsMet !== null) return callsMet ? s.semana : null;
    return agMet ? s.semana : null;
  }).filter(Boolean);

  const weeksWithMeta = achievedWeeks.length;
  const totalWeeks = (chartData.semanas || []).length || chartData.semanaNums.length;

  return (
    <div className="historial-mes">
      <h4 style={{ marginBottom: 8 }}>Resumen del Mes: {mesData.mes} {mesData.anio}</h4>

      <div className="month-summary">
        <div className="month-stat-card">
          <div className="label">Total Llamadas</div>
          <div className="value">{totals.totalCalls}</div>
        </div>

        <div className="month-stat-card">
          <div className="label">Total Acuerdos</div>
          <div className="value">{totals.totalAg}</div>
        </div>

        <div className="month-stat-card">
          <div className="label">Semanas con meta</div>
          <div className="value">{weeksWithMeta}/{totalWeeks}</div>
        </div>
      </div>

      <div className="historial-charts">
        <div className="chart-card-compact">
          <h5>Llamadas vs Meta (por semana)</h5>
          <div style={{ height: 260 }}>
            <Bar
              data={llamadasDataset}
              options={{
                ...baseOptions,
                maintainAspectRatio: false,
                plugins: { ...baseOptions.plugins, legend: { position: 'top', labels: { boxWidth: 12, padding: 8 } } },
                scales: {
  x: {
    stacked: false,
    barPercentage: 0.6,       // ancho relativo de cada barra
    categoryPercentage: 0.8,  // espacio entre grupos de barras
  },
  y: {
    beginAtZero: true
  }
}

              }}
            />
          </div>
        </div>

        <div className="chart-card-compact">
          <h5>Acuerdos vs Meta (por semana)</h5>
          <div style={{ height: 260 }}>
            <Bar
              data={acuerdosDataset}
              options={{
                ...baseOptions,
                maintainAspectRatio: false,
                plugins: { ...baseOptions.plugins, legend: { position: 'top', labels: { boxWidth: 12, padding: 8 } } },
                scales: {
  x: {
    stacked: false,
    barPercentage: 0.6,
    categoryPercentage: 0.8,
  },
  y: {
    beginAtZero: true
  }
}

              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialMes;
