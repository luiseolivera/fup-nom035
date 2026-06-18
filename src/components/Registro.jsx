import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Registro({ empresa, onVerified }) {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    nombreEmpresa: "",
    nombrePersona: "",
    puesto: "",
    correo: "",
    whatsapp: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleForm(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!form.nombrePersona || !form.correo || !form.whatsapp) {
      return setError("Por favor completa todos los campos obligatorios.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      return setError("El correo electrónico no es válido.");
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: form.correo,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setError("Error al enviar el código: " + error.message);
    } else {
      setStep("otp");
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("El código debe tener 6 dígitos.");
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: form.correo,
      token: otp,
      type: "email",
    });
    if (error) {
      setError("Código incorrecto o expirado. Revisa tu correo.");
      setLoading(false);
      return;
    }
    // Save profile
    await supabase.from("perfiles").upsert(
      {
        user_id: data.user.id,
        empresa,
        nombre_empresa: form.nombreEmpresa,
        nombre_persona: form.nombrePersona,
        puesto: form.puesto,
        whatsapp: form.whatsapp,
      },
      { onConflict: "user_id,empresa" }
    );
    // Notify admin
    supabase.functions.invoke("notificar-registro", {
      body: {
        empresa,
        nombre_empresa: form.nombreEmpresa,
        nombre_persona: form.nombrePersona,
        puesto: form.puesto,
        correo: form.correo,
        whatsapp: form.whatsapp,
      },
    });
    setLoading(false);
    onVerified();
  }

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "#1D3557" }}
          >
            <i className="ti ti-user-plus text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#1D3557" }}>
            Registro de acceso
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            NOM-035-STPS-2018 · {empresa}
          </p>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Nombre de la empresa
              </label>
              <input
                className={inputCls}
                value={form.nombreEmpresa}
                onChange={handleForm("nombreEmpresa")}
                placeholder="Empresa S.A. de C.V."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                value={form.nombrePersona}
                onChange={handleForm("nombrePersona")}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Puesto en la empresa
              </label>
              <input
                className={inputCls}
                value={form.puesto}
                onChange={handleForm("puesto")}
                placeholder="Ej: Responsable de RH"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                type="email"
                value={form.correo}
                onChange={handleForm("correo")}
                placeholder="correo@empresa.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls}
                type="tel"
                value={form.whatsapp}
                onChange={handleForm("whatsapp")}
                placeholder="722 123 4567"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <i className="ti ti-alert-circle"></i> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: "#1D3557" }}
            >
              {loading ? "Enviando código..." : "Verificar correo electrónico"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Te enviaremos un código de 6 dígitos para confirmar tu correo.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div
              className="rounded-lg p-4 text-sm text-center"
              style={{ background: "#E6F1FB" }}
            >
              <i className="ti ti-mail text-blue-500 text-2xl mb-2 block"></i>
              <p className="text-blue-800 font-medium">Revisa tu correo</p>
              <p className="text-blue-600 text-xs mt-1">
                Enviamos un código de 6 dígitos a{" "}
                <strong>{form.correo}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Código de verificación
              </label>
              <input
                className={`${inputCls} text-center text-2xl tracking-widest font-bold`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <i className="ti ti-alert-circle"></i> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: "#1D3557" }}
            >
              {loading ? "Verificando..." : "Entrar a la herramienta"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("form"); setError(""); setOtp(""); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 text-center"
            >
              ← Volver y corregir datos
            </button>
          </form>
        )}
      </div>

      <footer className="mt-6 text-xs text-gray-400 text-center">
        Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.
        · <a href="https://consentidohumano.com" target="_blank" rel="noreferrer" className="underline">consentidohumano.com</a>
      </footer>
    </div>
  );
}
