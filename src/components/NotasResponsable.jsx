export default function NotasResponsable({ pasoId, notas, setNotas, rol }) {
  const editable = rol === "responsable";
  const valor = notas[pasoId] || "";

  function handleChange(e) {
    setNotas((prev) => ({ ...prev, [pasoId]: e.target.value }));
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
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
          onChange={handleChange}
        />
      ) : (
        <p className="text-sm text-gray-500 italic min-h-[3rem]">
          {valor || "Sin notas del responsable."}
        </p>
      )}
    </div>
  );
}
