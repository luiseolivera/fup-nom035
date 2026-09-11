function redimensionarImagen(file, maxAncho = 400, maxAlto = 160) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const escala = Math.min(maxAncho / width, maxAlto / height, 1);
        width = Math.max(1, Math.round(width * escala));
        height = Math.max(1, Math.round(height * escala));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const esPng = file.type === "image/png";
        resolve(canvas.toDataURL(esPng ? "image/png" : "image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

export default function EmpresaBar({ datos, setDatos, rol }) {
  const editable = rol === "consultor";

  function handle(field) {
    return (e) => setDatos((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await redimensionarImagen(file);
      setDatos((prev) => ({ ...prev, logo: dataUrl }));
    } catch {
      // Si falla la lectura, simplemente no se actualiza el logo.
    }
    e.target.value = "";
  }

  function quitarLogo() {
    setDatos((prev) => ({ ...prev, logo: "" }));
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
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

        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="block text-xs text-gray-500 mb-1">Logo de la empresa</label>
          <p className="text-xs text-gray-400 mb-2">
            Se usa para reemplazar el "LOGO DE LA EMPRESA" en los formatos que se generan automáticamente (ATS, canalización, etc.).
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {datos.logo && (
              <img
                src={datos.logo}
                alt="Logo de la empresa"
                className="h-12 max-w-[160px] object-contain border border-gray-200 rounded-lg p-1 bg-white"
              />
            )}
            {editable && (
              <>
                <label className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-white cursor-pointer transition" style={{ background: "#1D3557" }}>
                  <i className="ti ti-upload text-sm"></i>
                  {datos.logo ? "Cambiar logo" : "Subir logo"}
                  <input type="file" accept="image/png,image/jpeg" onChange={handleLogo} className="hidden" />
                </label>
                {datos.logo && (
                  <button
                    type="button"
                    onClick={quitarLogo}
                    className="text-xs font-medium text-gray-500 hover:text-red-500 transition"
                  >
                    Quitar
                  </button>
                )}
              </>
            )}
            {!datos.logo && !editable && (
              <p className="text-xs text-gray-400 italic">Sin logo. Solo el consultor puede subirlo.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
