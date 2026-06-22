import { useState, useEffect } from "react";
import { useEmpresa } from "./hooks/useEmpresa";
import { useAuth } from "./hooks/useAuth";
import { useSupabaseData } from "./hooks/useSupabaseData";
import { supabase } from "./lib/supabase";
import { PASOS } from "./data/pasos";
import Bienvenida from "./components/Bienvenida";
import Registro from "./components/Registro";
import Header from "./components/Header";
import EmpresaBar from "./components/EmpresaBar";
import Dashboard from "./components/Dashboard";
import PasoCard from "./components/PasoCard";
import ModalAyuda from "./components/ModalAyuda";

function Spinner({ texto }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">{texto || "Cargando..."}</p>
      </div>
    </div>
  );
}

export default function App() {
  const empresa = useEmpresa();
  const { session, loading: authLoading } = useAuth();
  const [tienePerfil, setTienePerfil] = useState(null); // null=checking, true, false
  const [rol, setRol] = useState("responsable");
  const [modalAyuda, setModalAyuda] = useState(false);

  const {
    loading: dataLoading,
    datos, setDatos,
    checklist, setChecklist,
    notas, setNotas,
    comentarios, setComentarios,
  } = useSupabaseData(empresa && session ? empresa : null);

  // If user has a session, auto-create profile for this empresa if missing
  useEffect(() => {
    if (!empresa || !session) { setTienePerfil(false); return; }
    supabase
      .from("perfiles")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("empresa", empresa)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) { setTienePerfil(true); return; }
        await supabase.from("perfiles").upsert(
          { user_id: session.user.id, empresa },
          { onConflict: "user_id,empresa" }
        );
        setTienePerfil(true);
      });
  }, [empresa, session]);

  if (!empresa) return <Bienvenida />;
  if (authLoading || tienePerfil === null) return <Spinner texto="Verificando acceso..." />;
  if (!session || !tienePerfil) return <Registro empresa={empresa} onVerified={() => setTienePerfil(true)} />;
  if (dataLoading) return <Spinner texto="Cargando datos..." />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      <Header
        rol={rol}
        setRol={setRol}
        empresa={empresa}
        onHelp={() => setModalAyuda(true)}
      />

      <EmpresaBar datos={datos} setDatos={setDatos} rol={rol} />

      <main className="flex-1 pb-12">
        <Dashboard checklist={checklist} datos={datos} />

        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {PASOS.map((paso) => (
            <PasoCard
              key={paso.id}
              paso={paso}
              checklist={checklist}
              setChecklist={setChecklist}
              notas={notas}
              setNotas={setNotas}
              comentarios={comentarios}
              setComentarios={setComentarios}
              rol={rol}
            />
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200 bg-white">
        Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.
        ·{" "}
        <a href="https://consentidohumano.com" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">
          consentidohumano.com
        </a>
      </footer>

      {modalAyuda && <ModalAyuda onClose={() => setModalAyuda(false)} />}
    </div>
  );
}
