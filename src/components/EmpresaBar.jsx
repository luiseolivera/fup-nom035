export default function EmpresaBar({ datos, setDatos, rol }) {
  const editable = rol === "responsable" || rol === "consultor";

  function handle(field) {
    return (e) => setDatos((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Datos del centro de trabajo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nombre del centro de trabajo</label>
            <input
              className={inputCls}
              value={datos.nombre || ""}
              onChange={handle("nombre")}
              disabled={!editable}
              placeholder="Empresa S.A. de C.V."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Número de trabajadores</label>
            <input
              className={inputCls}
              type="number"
              min="1"
              value={datos.trabajadores || ""}
              onChange={handle("trabajadores")}
              disabled={!editable}
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Responsable de seguimiento</label>
            <input
              className={inputCls}
              value={datos.responsable || ""}
              onChange={handle("responsable")}
              disabled={!editable}
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fecha de inicio del proceso</label>
            <input
              className={inputCls}
              type="date"
              value={datos.fechaInicio || ""}
              onChange={handle("fechaInicio")}
              disabled={!editable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
