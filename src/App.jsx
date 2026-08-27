import { useState } from "react";
import { useEmpresa } from "./hooks/useEmpresa";
import { useSupabaseData } from "./hooks/useSupabaseData";
import { PASOS } from "./data/pasos";
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

function useIsDemo() {
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "1";
}

export default function App() {
  const empresa = useEmpresa();
  const isDemo = useIsDemo();
  const [rol, setRol] = useState("responsable");
  const [modalAyuda, setModalAyuda] = useState(false);

  // Estado local del modo de prueba: nunca se guarda en Supabase.
  const [demoDatos, setDemoDatos] = useState({});
  const [demoChecklist, setDemoChecklist] = useState({});
  const [demoNotas, setDemoNotas] = useState({});
  const [demoComentarios, setDemoComentarios] = useState({});

  const {
    loading: dataLoading,
    datos, setDatos,
    checklist, setChecklist,
    notas, setNotas,
    comentarios, setComentarios,
  } = useSupabaseData(!isDemo && empresa ? empresa : null);

  // No empresa en la URL y no es modo de prueba → mostrar registro
  if (!isDemo && !empresa) return <Registro />;
  if (!isDemo && dataLoading) return <Spinner texto="Cargando datos..." />;

  const datosActivos = isDemo ? demoDatos : datos;
  const setDatosActivos = isDemo ? setDemoDatos : setDatos;
  const checklistActivo = isDemo ? demoChecklist : checklist;
  const setChecklistActivo = isDemo ? setDemoChecklist : setChecklist;
  const notasActivas = isDemo ? demoNotas : notas;
  const setNotasActivas = isDemo ? setDemoNotas : setNotas;
  const comentariosActivos = isDemo ? demoComentarios : comentarios;
  const setComentariosActivos = isDemo ? setDemoComentarios : setComentarios;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      <Header
        rol={rol}
        setRol={setRol}
        empresa={empresa}
        onHelp={() => setModalAyuda(true)}
        demo={isDemo}
      />

      <EmpresaBar datos={datosActivos} setDatos={setDatosActivos} rol={rol} />

      <main className="flex-1 pb-12">
        <Dashboard checklist={checklistActivo} datos={datosActivos} />

        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {PASOS.map((paso) => (
            <PasoCard
              key={paso.id}
              paso={paso}
              checklist={checklistActivo}
              setChecklist={setChecklistActivo}
              notas={notasActivas}
              setNotas={setNotasActivas}
              comentarios={comentariosActivos}
              setComentarios={setComentariosActivos}
              rol={rol}
              locked={isDemo && paso.id !== 1}
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
