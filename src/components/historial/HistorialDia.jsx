import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Phone, Handshake, UserCheck, Clock } from 'lucide-react';
import { formatearFechaCompleta } from './historialUtils';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import '../Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function formatMinutesToHours(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m.toFixed(0)}min`;
  return `${h}h`;
}

// Tooltip personalizado: muestra cantidad y porcentaje
const getTooltipCallbacks = (labels, data) => ({
  title: function(context) {
    const idx = context[0].dataIndex;
    return [labels[idx]];
  },
  label: function(context) {
    const value = context.parsed;
    const total = data.reduce((a, b) => a + b, 0);
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return `Cantidad llamadas: ${value} (${percent}%)`;
  }
});

const HistorialDia = ({ datosVista, historical }) => {
  if (!datosVista) {
    return (
      <div className="mensaje-inicial">
        <p>Seleccioná una fecha para ver el detalle del día.</p>
        <p>Podrás ver si se cumplió la meta de la semana correspondiente.</p>
      </div>
    );
  }

  // Fecha legible para las cards (formato igual al dashboard)
  const fechaLegible = formatearFechaCompleta(datosVista.fechaLegible || datosVista.fecha || '');

  // Semana y metas
  const semanaActual = datosVista.semanaInfo.semana;
  const metaSemanaObj = historical.goalsByWeek.find(g => g.semana === semanaActual);
  const metaLlamadas = metaSemanaObj ? metaSemanaObj.dailyCalls : 0;
  const metaAcuerdos = metaSemanaObj ? metaSemanaObj.dailyAgreements : 0;

  // Valores realizados en la semana y día
  const llamadasSemana = datosVista.semanaInfo.llamadas || 0;
  const acuerdosSemana = datosVista.semanaInfo.acuerdos || 0;
  const llamadasRealizadas = datosVista.llamadas || 0;
  const acuerdosLogrados = datosVista.acuerdos || 0;

  // Pie chart para llamadas
  const restanteSemanaLlamadas = Math.max(llamadasSemana - llamadasRealizadas, 0);
  const faltanteMetaLlamadas = Math.max(metaLlamadas - llamadasSemana, 0);
  const llamadasPieLabels = [
    'Día',
    'Semana restante',
    'Faltante meta'
  ];
  const llamadasPieData = [llamadasRealizadas, restanteSemanaLlamadas, faltanteMetaLlamadas];
  const llamadasPieChart = {
    labels: llamadasPieLabels,
    datasets: [
      {
        data: llamadasPieData,
        backgroundColor: ['#5dade2', '#85c1e9', '#f0f0f0'],
        borderWidth: 0,
      }
    ]
  };

  // Pie chart para acuerdos
  const restanteSemanaAcuerdos = Math.max(acuerdosSemana - acuerdosLogrados, 0);
  const faltanteMetaAcuerdos = Math.max(metaAcuerdos - acuerdosSemana, 0);
  const acuerdosPieLabels = [
    'Día',
    'Semana restante',
    'Faltante meta'
  ];
  const acuerdosPieData = [acuerdosLogrados, restanteSemanaAcuerdos, faltanteMetaAcuerdos];
  const acuerdosPieChart = {
    labels: acuerdosPieLabels,
    datasets: [
      {
        data: acuerdosPieData,
        backgroundColor: ['#2ecc71', '#82e0aa', '#f0f0f0'],
        borderWidth: 0,
      }
    ]
  };

  // Métricas diarias
  const llamadasContestadas = datosVista.contestadas || 0;
  const duracionPromedio = datosVista.duracion || 0;
  const duracionTotal = llamadasContestadas * duracionPromedio;
  const efectividad = llamadasContestadas > 0 ? Math.round((acuerdosLogrados / llamadasContestadas) * 100) : 0;
  const tasaContacto = llamadasRealizadas > 0 ? Math.round((llamadasContestadas / llamadasRealizadas) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        {/* Llamadas */}
        <div className="chart-individual-container">
          <div className="chart-card">
            <div className="chart-wrapper-large">
              <Pie
                data={llamadasPieChart}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: getTooltipCallbacks(llamadasPieLabels, llamadasPieData)
                    }
                  }
                }}
              />
            </div>
          </div>
          {/* Título, leyenda y barrita al costado */}
          <div className="legend-container">
            <h4 className="chart-title" style={{ color: '#222', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              Meta de llamadas semanal
            </h4>
            <div className="chart-meta" style={{ margin: '12px 0 18px 0' }}>
              Total: {llamadasSemana} / Meta: {metaLlamadas}
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#5dade2' }}></div>
                <span className="legend-text">Día</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#85c1e9' }}></div>
                <span className="legend-text">Semana restante</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#f0f0f0' }}></div>
                <span className="legend-text">Faltante meta</span>
              </div>
            </div>
          </div>
        </div>
        {/* Acuerdos */}
        <div className="chart-individual-container">
          <div className="chart-card">
            <div className="chart-wrapper-large">
              <Pie
                data={acuerdosPieChart}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      callbacks: getTooltipCallbacks(acuerdosPieLabels, acuerdosPieData)
                    }
                  }
                }}
              />
            </div>
          </div>
          {/* Título, leyenda y barrita al costado */}
          <div className="legend-container">
            <h4 className="chart-title" style={{ color: '#222', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              Meta de acuerdos semanal
            </h4>
            <div className="chart-meta" style={{ margin: '12px 0 18px 0' }}>
              Total: {acuerdosSemana} / Meta: {metaAcuerdos}
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#2ecc71' }}></div>
                <span className="legend-text">Día</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#82e0aa' }}></div>
                <span className="legend-text">Semana restante</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#f0f0f0' }}></div>
                <span className="legend-text">Faltante meta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de métricas diarias */}
      <div className="daily-summary-container">
        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon calls-icon">
              <Phone size={32} />
            </div>
            <div className="daily-card-badge">{fechaLegible}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{llamadasRealizadas}</div>
            <div className="daily-card-label">Llamadas realizadas</div>
          </div>
          <div className="daily-card-footer">
            <div className="daily-card-trend">
              Tiempo total: {formatMinutesToHours(duracionTotal)}
            </div>
          </div>
        </div>
        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon agreements-icon">
              <Handshake size={32} />
            </div>
            <div className="daily-card-badge">{fechaLegible}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{acuerdosLogrados}</div>
            <div className="daily-card-label">Acuerdos logrados</div>
          </div>
          <div className="daily-card-footer">
            <div className="daily-card-trend">
              Efectividad: {efectividad}%
            </div>
          </div>
        </div>
        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon" style={{ background: '#3498db' }}>
              <UserCheck size={32} />
            </div>
            <div className="daily-card-badge">{fechaLegible}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{tasaContacto}%</div>
            <div className="daily-card-label">Tasa de contacto efectivo</div>
          </div>
        </div>
        <div className="daily-card">
          <div className="daily-card-header">
            <div className="daily-card-icon" style={{ background: '#27ae60' }}>
              <Clock size={32} />
            </div>
            <div className="daily-card-badge">{fechaLegible}</div>
          </div>
          <div className="daily-card-content">
            <div className="daily-card-number">{duracionPromedio} min</div>
            <div className="daily-card-label">Duración promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistorialDia;