export default function ComentariosConsultor({ pasoId, comentarios, setComentarios, rol }) {
  const editable = rol === "consultor";
  const valor = comentarios[pasoId] || "";

  function handleChange(e) {
    setComentarios((prev) => ({ ...prev, [pasoId]: e.target.value }));
  }

  return (
    <div
      className="mt-3 border border-blue-100 rounded-lg p-4"
      style={{ background: "#E6F1FB" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-briefcase text-blue-400 text-base"></i>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Recomendación del consultor
        </span>
      </div>
      {editable ? (
        <textarea
          rows={3}
          className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          placeholder="Escribe aquí tu recomendación para este paso..."
          value={valor}
          onChange={handleChange}
        />
      ) : (
        <p className="text-sm text-blue-700 italic min-h-[3rem]">
          {valor || "Sin recomendaciones del consultor."}
        </p>
      )}
    </div>
  );
}
