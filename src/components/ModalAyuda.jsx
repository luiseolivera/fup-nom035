import { useState } from "react";

const FAQS = [
  {
    p: "¿Necesito crear una cuenta?",
    r: "No. Solo necesitas el enlace que te dio tu consultor.",
  },
  {
    p: "¿Mis datos están seguros?",
    r: "Los datos se guardan en tu propio navegador. Nadie más puede verlos a menos que tenga el enlace.",
  },
  {
    p: "¿Puedo usarlo en el celular?",
    r: "Sí, la app funciona en cualquier dispositivo con navegador.",
  },
  {
    p: "¿Qué pasa si borro el historial del navegador?",
    r: "Los datos podrían perderse. Usa siempre el mismo dispositivo y navegador para el seguimiento.",
  },
  {
    p: "¿Cómo sé que puedo solicitar el dictamen?",
    r: "Cuando el Paso 7 aparezca como 'Completado' y la barra de progreso esté al 100%. Tu consultor te acompañará en ese paso final.",
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex justify-between items-center py-3 text-left text-sm font-medium text-gray-700 hover:text-blue-700 transition"
        onClick={() => setOpen((v) => !v)}
      >
        {faq.p}
        <i className={`ti ${open ? "ti-chevron-up" : "ti-chevron-down"} text-gray-400 flex-shrink-0 ml-2`}></i>
      </button>
      {open && (
        <p className="text-sm text-gray-500 pb-3 pr-4">{faq.r}</p>
      )}
    </div>
  );
}

export default function ModalAyuda({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4" style={{ background: "#1D3557" }}>
          <div>
            <h2 className="text-lg font-bold text-white">¿Cómo usar esta herramienta?</h2>
            <p className="text-sm text-blue-200 mt-0.5">Seguimiento NOM-035-STPS-2018</p>
            <p className="text-xs text-blue-300 mt-1">Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white mt-1">
            <i className="ti ti-x text-xl"></i>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Roles */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Los tres roles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: "ti-user",
                  title: "Responsable",
                  desc: "El empleado designado para operar el proceso. Puede marcar actividades, escribir notas y descargar formatos.",
                  color: "#1D3557",
                },
                {
                  icon: "ti-eye",
                  title: "Director",
                  desc: "El dueño o director general. Ve el avance y las notas, sin poder modificar nada.",
                  color: "#64748b",
                },
                {
                  icon: "ti-briefcase",
                  title: "Consultor",
                  desc: "El asesor de CRESE. Ve todo y puede dejar recomendaciones por paso.",
                  color: "#2563eb",
                },
              ].map((r) => (
                <div key={r.title} className="border border-gray-100 rounded-xl p-4 text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ background: r.color + "15" }}
                  >
                    <i className={`ti ${r.icon} text-xl`} style={{ color: r.color }}></i>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cómo entrar */}
          <section>
            <div className="rounded-xl p-4 text-sm" style={{ background: "#E6F1FB" }}>
              <p className="font-semibold text-blue-800 mb-1">Cómo entrar</p>
              <p className="text-blue-700 text-xs mb-2">Tu consultor te proporcionará un enlace personalizado.</p>
              <code className="block bg-white rounded px-3 py-1.5 text-xs text-blue-900 border border-blue-100 mb-2">
                fup-nom035.vercel.app?empresa=tu-empresa
              </code>
              <p className="text-xs text-blue-600">El enlace es el mismo para los tres roles. El rol se selecciona dentro de la app.</p>
            </div>
          </section>

          {/* Pasos para el Responsable */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pasos para el Responsable</h3>
            <ol className="space-y-2">
              {[
                "Abre el enlace que te compartió tu consultor",
                'Selecciona el rol "Responsable" en la parte superior',
                "Haz clic en cada paso para expandirlo",
                "Marca cada actividad cuando la completes",
                "Escribe notas si es necesario",
                'Descarga los formatos con "Abrir formato/recurso"',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5 font-bold"
                    style={{ background: "#1D3557" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Preguntas frecuentes</h3>
            <div className="border border-gray-100 rounded-xl px-4">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 text-center text-xs text-gray-400">
          ¿Dudas? Escribe a{" "}
          <a href="mailto:info@crese.org" className="text-blue-600 hover:underline">
            info@crese.org
          </a>
          {" · "}
          <a href="https://consentidohumano.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            consentidohumano.com
          </a>
        </div>
      </div>
    </div>
  );
}
