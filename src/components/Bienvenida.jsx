import { useState } from "react";

export default function Bienvenida() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  function handleChange(e) {
    const val = e.target.value.toLowerCase().replace(/\s+/g, "-");
    setSlug(val);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!slug) return setError("Por favor escribe un identificador.");
    if (!slugRegex.test(slug))
      return setError(
        "Solo letras minúsculas, números y guiones. Sin espacios ni caracteres especiales."
      );
    window.location.search = `?empresa=${slug}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo / branding */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#1D3557" }}
        >
          <i className="ti ti-shield-check text-white text-3xl"></i>
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#1D3557" }}>
          CRESE
        </p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1D3557" }}>
          NOM-035-STPS-2018
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Herramienta de seguimiento
        </p>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identificador de Centro de Trabajo
            </label>
            <input
              type="text"
              value={slug}
              onChange={handleChange}
              placeholder=""
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#1D3557" }}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: "#1D3557" }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Iniciar seguimiento
          </button>
        </form>

      </div>

      <footer className="mt-8 text-xs text-gray-400 text-center">
        Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.
        ·{" "}
        <a
          href="https://consentidohumano.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          consentidohumano.com
        </a>
      </footer>
    </div>
  );
}
