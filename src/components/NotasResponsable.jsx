export default function NotasResponsable({ pasoId, notas, setNotas, rol }) {
  const editable = rol === "responsable";
  const valor = notas[pasoId] || "";
  const enlaceKey = `${pasoId}-evidencia`;
  const enlace = notas[enlaceKey] || "";

  const esUrl = (v) => {
    try { new URL(v); return true; } catch { return false; }
  };

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Notas */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <i className="ti ti-user text-gray-400 text-base"></i>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Notas del responsable
          </span>
        </div>
        {editable ? (
          <textarea
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Escribe aquí tus notas o avances..."
            value={valor}
            onChange={(e) => setNotas((prev) => ({ ...prev, [pasoId]: e.target.value }))}
          />
        ) : (
          <p className="text-sm text-gray-500 italic min-h-[3rem]">
            {valor || "Sin notas del responsable."}
          </p>
        )}
      </div>

      {/* Enlace de evidencias */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <i className="ti ti-paperclip text-gray-400 text-base"></i>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Carpeta de evidencias
          </span>
        </div>
        {editable ? (
          <div className="flex gap-2 items-center">
            <input
              type="url"
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Pega aquí el enlace de tu carpeta (Google Drive, OneDrive, Dropbox...)"
              value={enlace}
              onChange={(e) => setNotas((prev) => ({ ...prev, [enlaceKey]: e.target.value }))}
            />
            {enlace && esUrl(enlace) && (
              <a
                href={enlace}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium text-white transition"
                style={{ background: "#1D3557" }}
              >
                <i className="ti ti-external-link text-sm"></i>
                Abrir
              </a>
            )}
          </div>
        ) : enlace && esUrl(enlace) ? (
          <a
            href={enlace}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "#1D3557" }}
          >
            <i className="ti ti-folder text-base"></i>
            Ver carpeta de evidencias
          </a>
        ) : (
          <p className="text-sm text-gray-400 italic">Sin enlace de evidencias.</p>
        )}
      </div>
    </div>
  );
}
