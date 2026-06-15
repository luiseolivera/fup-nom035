import { useState } from "react";

const PASSWORD = "CRESE2026";

export default function ModalPassword({ onSuccess, onCancel }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === PASSWORD) {
      onSuccess();
    } else {
      setError("Contraseña incorrecta.");
      setValue("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#1D3557" }}
          >
            <i className="ti ti-briefcase text-white text-lg"></i>
          </div>
          <div>
            <p className="font-bold text-gray-800">Acceso de Consultor</p>
            <p className="text-xs text-gray-400">Ingresa la contraseña para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoFocus
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              placeholder="Contraseña"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className={`ti ${show ? "ti-eye-off" : "ti-eye"} text-base`}></i>
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <i className="ti ti-alert-circle"></i> {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: "#1D3557" }}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
