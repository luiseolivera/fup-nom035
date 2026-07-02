import { PASOS } from "../data/pasos";

function getCheckIds(paso) {
  return paso.actividades
    .filter((a) => !a.tipo || a.tipo === "check")
    .map((a) => a.id);
}

function getPasoPct(paso, checklist) {
  const ids = getCheckIds(paso);
  if (ids.length === 0) return 0;
  return Math.round((ids.filter((id) => checklist[id]).length / ids.length) * 100);
}

export default function Dashboard({ checklist, datos }) {
  const pasosPct = PASOS.map((p) => getPasoPct(p, checklist));

  const completados = pasosPct.filter((p) => p === 100).length;
  const enProceso = pasosPct.filter((p) => p > 0 && p < 100).length;
  const pendientes = pasosPct.filter((p) => p === 0).length;
  const total = PASOS.length;

  const pct = Math.round(pasosPct.reduce((s, p) => s + p, 0) / total);

  const fechaInicio = datos.fechaInicio ? new Date(datos.fechaInicio) : null;
  const diasTranscurridos = fechaInicio
    ? Math.floor((Date.now() - fechaInicio.getTime()) / 86400000)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* Progreso general */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progreso general</span>
          <span className="text-xl font-bold" style={{ color: "#1D3557" }}>{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? "#22c55e" : pct > 0 ? "#E9C46A" : "#e5e7eb",
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

        {/* Barras verticales por paso */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-end gap-2 h-32">
            {PASOS.map((paso, i) => {
              const p = pasosPct[i];
              const color = p === 0 ? "#ef4444" : p < 40 ? "#f97316" : p < 75 ? "#E9C46A" : p < 100 ? "#3b82f6" : "#22c55e";
              return (
                <div key={paso.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold" style={{ color }}>
                    {p}%
                  </span>
                  <div className="w-full bg-gray-100 rounded-t-md overflow-hidden" style={{ height: "80px" }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${p}%`,
                        marginTop: `${100 - p}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{paso.id}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center">Avance por cada punto</p>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, total, color, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: color + "20" }}>
        <i className={`ti ${icon} text-xl`} style={{ color }}></i>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {label} <span className="text-gray-300">/ {total}</span>
      </p>
    </div>
  );
}
