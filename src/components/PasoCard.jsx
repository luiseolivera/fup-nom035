import { useState } from "react";
import NotasResponsable from "./NotasResponsable";
import ComentariosConsultor from "./ComentariosConsultor";

function getEstado(paso, checklist) {
  const ids = paso.actividades.map((a) => a.id);
  const completadas = ids.filter((id) => checklist[id]).length;
  if (completadas === 0) return "pendiente";
  if (completadas === ids.length) return "completado";
  return "en-proceso";
}

const ESTADO_STYLES = {
  pendiente: { bg: "#f1f5f9", text: "#64748b", label: "Pendiente", dot: "#94a3b8" },
  "en-proceso": { bg: "#fefce8", text: "#b45309", label: "En proceso", dot: "#E9C46A" },
  completado: { bg: "#f0fdf4", text: "#15803d", label: "Completado", dot: "#22c55e" },
};

export default function PasoCard({
  paso,
  checklist,
  setChecklist,
  notas,
  setNotas,
  comentarios,
  setComentarios,
  rol,
}) {
  const [open, setOpen] = useState(false);
  const estado = getEstado(paso, checklist);
  const s = ESTADO_STYLES[estado];
  const canCheck = rol === "responsable";

  const completadas = paso.actividades.filter((a) => checklist[a.id]).length;
  const total = paso.actividades.length;

  function toggleActividad(id) {
    if (!canCheck) return;
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Paso number */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
          style={{ background: "#1D3557" }}
        >
          {paso.id}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{paso.titulo}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {completadas} de {total} actividades
          </p>
        </div>

        {/* Status badge */}
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5"
          style={{ background: s.bg, color: s.text }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: s.dot }}
          />
          {s.label}
        </span>

        {/* Chevron */}
        <i
          className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"} text-gray-400 flex-shrink-0`}
        ></i>
      </button>

      {/* Mini progress bar */}
      <div className="w-full bg-gray-100 h-1">
        <div
          className="h-1 transition-all duration-500"
          style={{
            width: `${(completadas / total) * 100}%`,
            background: estado === "completado" ? "#22c55e" : "#E9C46A",
          }}
        />
      </div>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 pt-4">
          <ul className="space-y-3">
            {paso.actividades.map((act) => (
              <li key={act.id} className="flex items-start gap-3">
                <button
                  onClick={() => toggleActividad(act.id)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${
                    checklist[act.id]
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300 bg-white"
                  } ${canCheck ? "cursor-pointer hover:border-green-400" : "cursor-default"}`}
                  disabled={!canCheck}
                  title={canCheck ? (checklist[act.id] ? "Marcar como pendiente" : "Marcar como completado") : "Solo el Responsable puede marcar actividades"}
                >
                  {checklist[act.id] && (
                    <i className="ti ti-check text-white text-xs"></i>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      checklist[act.id] ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {act.texto}
                  </p>
                  {act.link && (
                    <a
                      href={act.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs mt-1 font-medium hover:underline"
                      style={{ color: "#1D3557" }}
                    >
                      <i className="ti ti-external-link text-sm"></i>
                      {act.linkLabel || "Abrir formato/recurso"}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <NotasResponsable
            pasoId={paso.id}
            notas={notas}
            setNotas={setNotas}
            rol={rol}
          />
          <ComentariosConsultor
            pasoId={paso.id}
            comentarios={comentarios}
            setComentarios={setComentarios}
            rol={rol}
          />
        </div>
      )}
    </div>
  );
}
