import { Bar } from 'react-chartjs-2'; // Agrega arriba con los imports
import { CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement);
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { Phone, Handshake, ChevronLeft, ChevronRight } from 'lucide-react'; 
import React, { useState } from 'react';

const getTooltipCallbacks = (labels, data, meta) => ({
  title: function(context) {
    const idx = context[0].dataIndex;
    return [labels[idx]];
  },
  label: function(context) {
    const value = context.parsed;
    // El porcentaje se calcula sobre la meta (puede superar 100%)
    const percent = meta > 0 ? Math.round((value / meta) * 100) : 0;
    return `Cantidad: ${value} (${percent}%)`;
  }
});

const llamadasPieLabels = [
  'Llamadas Realizadas',
  'Llamadas Extra',
  'Llamadas Faltantes'
];
const acuerdosPieLabels = [
  'Acuerdos Realizados',
  'Acuerdos Extra',
  'Acuerdos Faltantes'
];

// Colores pastel y gris para faltantes (color fuerte primero)
const llamadasColors = ['#5dade2', '#85c1e9', '#f0f0f0']; // Realizadas fuerte, Extra pastel, Faltantes gris
const acuerdosColors = ['#2ecc71', '#82e0aa', '#f0f0f0']; // Realizados fuerte, Extra pastel, Faltantes gris

// Reutilizable: formatea minutos como en Dashboard (min / Hh Mmin / Hh)
const formatMinutesToHours = (minutes) => {
  if (typeof minutes !== 'number' || isNaN(minutes)) return '0 min';
  const m = Math.round(minutes); // evitar decimales
  if (m < 60) return `${m} min`;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  return `${hours}h`;
};

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

  // Datos para gráficos
  const llamadasRealizadas = semanaData.llamadas || 0;
  const metaLlamadas = metaSemana?.dailyCalls ?? 0;
  const llamadasFaltantes = Math.max(metaLlamadas - llamadasRealizadas, 0);
  const llamadasExtra = llamadasRealizadas > metaLlamadas ? llamadasRealizadas - metaLlamadas : 0;
  // Para la torta: realizadas hasta la meta, extra, faltantes
  const llamadasPieData = [
    Math.min(llamadasRealizadas, metaLlamadas),
    llamadasExtra,
    llamadasFaltantes
  ];

  const acuerdosRealizados = semanaData.acuerdos || 0;
  const metaAcuerdos = metaSemana?.dailyAgreements ?? 0;
  const acuerdosFaltantes = Math.max(metaAcuerdos - acuerdosRealizados, 0);
  const acuerdosExtra = acuerdosRealizados > metaAcuerdos ? acuerdosRealizados - metaAcuerdos : 0;
  // Para la torta: realizados hasta la meta, extra, faltantes
  const acuerdosPieData = [
    Math.min(acuerdosRealizados, metaAcuerdos),
    acuerdosExtra,
    acuerdosFaltantes
  ];

  return (
    <>
      {/* Gráficos de la semana */}
      <div className="graficos-semana" style={{ display: 'flex', gap: '40px', marginBottom: '40px', justifyContent: 'center' }}>
        {/* Gráfico de llamadas */}
        <div className="chart-individual-container">
          <div className="chart-card">
            <div className="chart-wrapper-large">
              <Pie
                data={{
                  labels: llamadasPieLabels,
                  datasets: [
                    {
                      data: llamadasPieData,
                      backgroundColor: llamadasColors,
                      borderWidth: 0,
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: getTooltipCallbacks(llamadasPieLabels, llamadasPieData, metaLlamadas)
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="legend-container">
            <h4 className="chart-title" style={{ color: '#222', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              Llamadas
            </h4>
            <div className="chart-meta" style={{ margin: '12px 0 18px 0', color: '#fff', fontWeight: 'bold' }}>
              Total: {llamadasRealizadas} / Meta: {metaLlamadas}
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: llamadasColors[0] }}></div>
                <span className="legend-text">Llamadas Realizadas</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: llamadasColors[1] }}></div>
                <span className="legend-text">Llamadas Extra</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: llamadasColors[2] }}></div>
                <span className="legend-text">Llamadas Faltantes</span>
              </div>
            </div>
          </div>
        </div>
        {/* Gráfico de acuerdos */}
        <div className="chart-individual-container">
          <div className="chart-card">
            <div className="chart-wrapper-large">
              <Pie
                data={{
                  labels: acuerdosPieLabels,
                  datasets: [
                    {
                      data: acuerdosPieData,
                      backgroundColor: acuerdosColors,
                      borderWidth: 0,
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: getTooltipCallbacks(acuerdosPieLabels, acuerdosPieData, metaAcuerdos)
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="legend-container">
            <h4 className="chart-title" style={{ color: '#222', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              Acuerdos
            </h4>
            <div className="chart-meta" style={{ margin: '12px 0 18px 0', color: '#fff', fontWeight: 'bold' }}>
              Total: {acuerdosRealizados} / Meta: {metaAcuerdos}
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: acuerdosColors[0] }}></div>
                <span className="legend-text">Acuerdos Realizados</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: acuerdosColors[1] }}></div>
                <span className="legend-text">Acuerdos Extra</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: acuerdosColors[2] }}></div>
                <span className="legend-text">Acuerdos Faltantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Días de la semana con carousel de día */}
      <div className="semana-contenido">
        {/* Carousel: muestra un día a la vez, con navegación */}
        {tablaSemana.length > 0 ? <WeekDayCarousel tablaSemana={tablaSemana} formatearFechaCompleta={formatearFechaCompleta} /> : (
          <div style={{ textAlign: 'center', color: '#666' }}>No hay datos de días para esta semana.</div>
        )}
      </div>

      <div className="indicators-dual-container">
        {/* Tasa de contacto efectivo */}
        <div className="indicator-chart-individual">
          <h4 className="indicator-chart-title">Tasa de Contacto Efectivo</h4>
          <div className="indicator-chart-wrapper" style={{ height: 300 }}>
            <Bar
              data={{
                labels: tablaSemana.map(d => d.dia),
                datasets: [{
                  label: 'Tasa de contacto (%)',
                  data: tablaSemana.map(d =>
                    d.llamadas > 0 ? Math.round((d.contestadas / d.llamadas) * 100) : 0
                  ),
                  backgroundColor: tablaSemana.map(d => d.esHoy ? '#3498db' : '#5dade2'),
                  borderColor: tablaSemana.map(d => d.esHoy ? '#2980b9' : '#4a9bd1'),
                  borderWidth: 2,
                  borderRadius: 6,
                  borderSkipped: false,
                  barPercentage: 0.9, // más estrechas
                  categoryPercentage: 0.6 // más estrechas
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        const dayData = tablaSemana[context.dataIndex];
                        const extra = dayData?.esHoy ? ' (HOY)' : '';
                        return `Tasa de contacto: ${value}%${extra}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: '#f0f0f0' },
                    ticks: {
                      color: '#666',
                      callback: function(value) { return value + '%'; }
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#666', font: { weight: 'bold' } }
                  }
                }
              }}
            />
          </div>
        </div>
        {/* Duración promedio de llamadas */}
        <div className="indicator-chart-individual">
          <h4 className="indicator-chart-title">Duración Promedio de Llamadas</h4>
          <div className="indicator-chart-wrapper" style={{ height: 300 }}>
            <Bar
              data={{
                labels: tablaSemana.map(d => d.dia),
                datasets: [{
                  label: 'Duración promedio (min)',
                  data: tablaSemana.map(d => d.duracion || 0),
                  backgroundColor: tablaSemana.map(d => d.esHoy ? '#27ae60' : '#2ecc71'),
                  borderColor: tablaSemana.map(d => d.esHoy ? '#219a52' : '#28a745'),
                  borderWidth: 2,
                  borderRadius: 6,
                  borderSkipped: false,
                  barPercentage: 0.8, // más estrechas
                  categoryPercentage: 0.6 // más estrechas
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        const dayData = tablaSemana[context.dataIndex];
                        const extra = dayData?.esHoy ? ' (HOY)' : '';
                        return `Duración promedio: ${value} min${extra}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 30, // límite a 30
                    grid: { color: '#f0f0f0' },
                    ticks: {
                      color: '#666',
                      callback: function(value) { return value + ' min'; }
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#666', font: { weight: 'bold' } }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HistorialSemana;

/* Carousel component for showing one day's cards at a time */
function WeekDayCarousel({ tablaSemana, formatearFechaCompleta }) {
  const [current, setCurrent] = useState(() => {
    if (!Array.isArray(tablaSemana)) return 0;
    const idxLunes = tablaSemana.findIndex(d => (d.dia || '').toString().toLowerCase().includes('lun'));
    return idxLunes >= 0 ? idxLunes : 0;
  });

  const prev = () => setCurrent((c) => (c - 1 + tablaSemana.length) % tablaSemana.length);
  const next = () => setCurrent((c) => (c + 1) % tablaSemana.length);

  const day = tablaSemana[current];

  // derived metrics (match logic used elsewhere)
  const llamadasRealizadas = day.llamadas || 0;
  const acuerdosLogrados = day.acuerdos || 0;
  const llamadasContestadas = day.contestadas || 0;
  const duracionPromedio = day.duracion || 0;
  const duracionTotal = llamadasContestadas * duracionPromedio;
  const efectividad = llamadasContestadas > 0 ? Math.round((acuerdosLogrados / llamadasContestadas) * 100) : 0;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={prev} aria-label="Anterior" className="carousel-nav-button"><ChevronLeft size={18} /></button>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{day.dia}</h3>
        <button onClick={next} aria-label="Siguiente" className="carousel-nav-button"><ChevronRight size={18} /></button>
      </div>

      <div className="daily-summary-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 720, width: '100%', justifyContent: 'center' }}>
        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon calls-icon"><Phone size={32} /></div>
            <div className="daily-card-badge">{formatearFechaCompleta(day.fecha)}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{llamadasRealizadas}</div>
            <div className="daily-card-label">Llamadas realizadas</div>
          </div>
          <div className="daily-card-footer">
            <div className="daily-card-trend">Tiempo total: {formatMinutesToHours(duracionTotal)}</div>
          </div>
        </div>

        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon agreements-icon"><Handshake size={32} /></div>
            <div className="daily-card-badge">{formatearFechaCompleta(day.fecha)}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{acuerdosLogrados}</div>
            <div className="daily-card-label">Acuerdos logrados</div>
          </div>
          <div className="daily-card-footer">
            <div className="daily-card-trend">Efectividad: {efectividad}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// nav button styles moved to CSS .carousel-nav-button