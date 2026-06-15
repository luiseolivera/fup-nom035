import { useState } from "react";

const ROLES = [
  { id: "responsable", label: "Responsable", icon: "ti-user" },
  { id: "director", label: "Director", icon: "ti-eye" },
  { id: "consultor", label: "Consultor", icon: "ti-briefcase" },
];

export default function Header({ rol, setRol, empresa, onHelp }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  return (
    <header
      className="sticky top-0 z-40 shadow-md"
      style={{ background: "#1D3557" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: logo + title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#E9C46A" }}
          >
            <i className="ti ti-shield-check text-white text-base"></i>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">
              NOM-035
            </p>
            <p className="text-xs leading-tight truncate" style={{ color: "#E9C46A" }}>
              {empresa}
            </p>
          </div>
        </div>

        {/* Right: copy link + help + role toggle */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/30 text-white/90 hover:bg-white/10 transition"
            title="Copiar enlace compartido"
          >
            <i className={`ti ${copied ? "ti-check" : "ti-copy"} text-sm`}></i>
            <span className="hidden sm:inline">
              {copied ? "¡Enlace copiado!" : "Copiar enlace"}
            </span>
          </button>

          <button
            onClick={onHelp}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition font-bold text-sm"
            title="Ayuda"
          >
            ?
          </button>

          {/* Role toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/30">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRol(r.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition"
                style={
                  rol === r.id
                    ? { background: "#E9C46A", color: "#1D3557" }
                    : { background: "transparent", color: "rgba(255,255,255,0.8)" }
                }
              >
                <i className={`ti ${r.icon} text-sm`}></i>
                <span className="hidden sm:inline">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {copied && (
        <div className="text-center text-xs py-1.5" style={{ background: "#E9C46A", color: "#1D3557" }}>
          Enlace copiado. Compártelo con el director y el consultor de esta empresa.
        </div>
      )}
    </header>
  );
}
