import { useState } from "react";
import NotasResponsable from "./NotasResponsable";
import ComentariosConsultor from "./ComentariosConsultor";

function getEstado(paso, checklist) {
  const ids = paso.actividades.filter((a) => !a.tipo || a.tipo === "check").map((a) => a.id);
  if (ids.length === 0) return "pendiente";
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

const RADIO4_OPCIONES = ["Sí", "No", "Más o menos", "No aplica"];

function ActividadNota({ act, notas, setNotas, rol }) {
  const editable = rol === "responsable";
  const valor = notas[act.id] || "";
  return (
    <li className="flex flex-col gap-1 pl-8">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas del responsable</span>
      {editable ? (
        <textarea
          rows={2}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={valor}
          onChange={(e) => setNotas((prev) => ({ ...prev, [act.id]: e.target.value }))}
        />
      ) : (
        valor ? <p className="text-sm text-gray-600 italic">{valor}</p> : null
      )}
    </li>
  );
}

function ActividadRadio4({ act, notas, setNotas, rol }) {
  const editable = rol === "responsable";
  const valor = notas[act.id] || "";
  return (
    <li className="flex flex-col gap-2">
      <p className="text-sm text-gray-700">{act.texto}</p>
      <div className="flex flex-wrap gap-2 pl-2">
        {RADIO4_OPCIONES.map((op) => (
          <button
            key={op}
            disabled={!editable}
            onClick={() => editable && setNotas((prev) => ({ ...prev, [act.id]: op }))}
            className="text-xs px-3 py-1 rounded-full border transition"
            style={
              valor === op
                ? { background: "#1D3557", color: "#fff", borderColor: "#1D3557" }
                : { background: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" }
            }
          >
            {op}
          </button>
        ))}
      </div>
    </li>
  );
}

function SeccionHeader({ act }) {
  if (!act.seccionTitulo) return null;
  return (
    <div className="mt-2 mb-3 pt-2 border-t border-gray-100">
      <p className="text-sm font-bold text-gray-700">{act.seccionTitulo}</p>
      {act.seccionAyuda && (
        <p className="text-xs text-gray-500 mt-1 italic">{act.seccionAyuda}</p>
      )}
      {act.seccionLink && (
        <a
          href={act.seccionLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs mt-1 font-medium hover:underline"
          style={{ color: "#1D3557" }}
        >
          <i className="ti ti-external-link text-sm"></i>
          {act.seccionLinkLabel || "Abrir recurso"}
        </a>
      )}
    </div>
  );
}

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
  const canCheck = rol === "responsable" || rol === "consultor";

  const checkActividades = paso.actividades.filter((a) => !a.tipo || a.tipo === "check");
  const completadas = checkActividades.filter((a) => checklist[a.id]).length;
  const total = checkActividades.length;

  function toggleActividad(id) {
    if (!canCheck) return;
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const hasSecciones = paso.actividades.some((a) => a.seccion);

  // Build section groups
  const secciones = [];
  if (hasSecciones) {
    const seen = {};
    paso.actividades.forEach((act) => {
      const key = act.seccion || "__";
      if (!seen[key]) {
        seen[key] = { seccion: key, actividades: [] };
        secciones.push(seen[key]);
      }
      seen[key].actividades.push(act);
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
        onClick={() => setOpen((v) => !v)}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
          style={{ background: "#1D3557" }}
        >
          {paso.id}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{paso.titulo}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {completadas} de {total} actividades
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5"
          style={{ background: s.bg, color: s.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: s.dot }} />
          {s.label}
        </span>
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"} text-gray-400 flex-shrink-0`}></i>
      </button>

      <div className="w-full bg-gray-100 h-1">
        <div
          className="h-1 transition-all duration-500"
          style={{
            width: `${total > 0 ? (completadas / total) * 100 : 0}%`,
            background: estado === "completado" ? "#22c55e" : "#E9C46A",
          }}
        />
      </div>

      {open && (
        <div className="px-5 pb-5 pt-4">
          {hasSecciones ? (
            secciones.map(({ seccion, actividades }) => (
              <div key={seccion} className="mb-2">
                <SeccionHeader act={actividades[0]} />
                <ul className="space-y-3">
                  {actividades.map((act) => {
                    if (act.tipo === "nota") {
                      return <ActividadNota key={act.id} act={act} notas={notas} setNotas={setNotas} rol={rol} />;
                    }
                    if (act.tipo === "radio4") {
                      return <ActividadRadio4 key={act.id} act={act} notas={notas} setNotas={setNotas} rol={rol} />;
                    }
                    return (
                      <li key={act.id} className="flex items-start gap-3">
                        <button
                          onClick={() => toggleActividad(act.id)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${
                            checklist[act.id] ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                          } ${canCheck ? "cursor-pointer hover:border-green-400" : "cursor-default"}`}
                          disabled={!canCheck}
                        >
                          {checklist[act.id] && <i className="ti ti-check text-white text-xs"></i>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${checklist[act.id] ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {act.texto}
                          </p>
                          {act.nota && (
                            <p className="text-xs mt-1 italic" style={{ color: "#2563eb" }}>({act.nota})</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <ComentariosConsultor
                  pasoId={`${paso.id}-${seccion}`}
                  comentarios={comentarios}
                  setComentarios={setComentarios}
                  rol={rol}
                />
              </div>
            ))
          ) : (
            <>
              <ul className="space-y-3">
                {paso.actividades.map((act) => (
                  <li key={act.id} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleActividad(act.id)}
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${
                        checklist[act.id] ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"
                      } ${canCheck ? "cursor-pointer hover:border-green-400" : "cursor-default"}`}
                      disabled={!canCheck}
                      title={canCheck ? (checklist[act.id] ? "Marcar como pendiente" : "Marcar como completado") : "Solo el Responsable puede marcar actividades"}
                    >
                      {checklist[act.id] && <i className="ti ti-check text-white text-xs"></i>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${checklist[act.id] ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {act.texto}
                      </p>
                      {act.link && (
                        <a href={act.link} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs mt-1 font-medium hover:underline"
                          style={{ color: "#1D3557" }}>
                          <i className="ti ti-external-link text-sm"></i>
                          {act.linkLabel || "Abrir formato/recurso"}
                        </a>
                      )}
                      {act.nota && (
                        <p className="text-xs mt-1 italic" style={{ color: "#2563eb" }}>({act.nota})</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <NotasResponsable pasoId={paso.id} notas={notas} setNotas={setNotas} rol={rol} />
              <ComentariosConsultor pasoId={paso.id} comentarios={comentarios} setComentarios={setComentarios} rol={rol} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
