import { PASOS } from "../data/pasos";

function getPasoEstado(paso, checklist) {
  const ids = paso.actividades.map((a) => a.id);
  const completadas = ids.filter((id) => checklist[id]).length;
  if (completadas === 0) return "pendiente";
  if (completadas === ids.length) return "completado";
  return "en-proceso";
}

export default function Dashboard({ checklist, datos }) {
  const estadosPasos = PASOS.map((p) => getPasoEstado(p, checklist));
  const completados = estadosPasos.filter((e) => e === "completado").length;
  const enProceso = estadosPasos.filter((e) => e === "en-proceso").length;
  const pendientes = estadosPasos.filter((e) => e === "pendiente").length;
  const total = PASOS.length;

  // Progreso real: promedio del % de avance de cada paso
  const pct = Math.round(
    PASOS.reduce((sum, paso) => {
      const totalActs = paso.actividades.length;
      const completadas = paso.actividades.filter((a) => checklist[a.id]).length;
      return sum + completadas / totalActs;
    }, 0) / total * 100
  );

  const fechaInicio = datos.fechaInicio ? new Date(datos.fechaInicio) : null;
  const diasTranscurridos = fechaInicio
    ? Math.floor((Date.now() - fechaInicio.getTime()) / 86400000)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progreso general
          </span>
          <span className="text-xl font-bold" style={{ color: "#1D3557" }}>
            {pct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                pct === 100
                  ? "#22c55e"
                  : pct > 0
                  ? "#E9C46A"
                  : "#e5e7eb",
            }}
          />
        </div>
        {fechaInicio && (
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>
              <i className="ti ti-calendar mr-1"></i>
              Inicio:{" "}
              {fechaInicio.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>
              <i className="ti ti-clock mr-1"></i>
              {diasTranscurridos} día{diasTranscurridos !== 1 ? "s" : ""} transcurrido{diasTranscurridos !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Completados"
          value={completados}
          total={total}
          color="#22c55e"
          icon="ti-circle-check"
        />
        <MetricCard
          label="En proceso"
          value={enProceso}
          total={total}
          color="#E9C46A"
          icon="ti-progress"
        />
        <MetricCard
          label="Pendientes"
          value={pendientes}
          total={total}
          color="#94a3b8"
          icon="ti-circle"
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, total, color, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
        style={{ background: color + "20" }}
      >
        <i className={`ti ${icon} text-xl`} style={{ color }}></i>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {label} <span className="text-gray-300">/ {total}</span>
      </p>
    </div>
  );
}
