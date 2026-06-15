import { useState } from "react";
import { useEmpresa } from "./hooks/useEmpresa";
import { useStorage } from "./hooks/useStorage";
import { PASOS } from "./data/pasos";
import Bienvenida from "./components/Bienvenida";
import Header from "./components/Header";
import EmpresaBar from "./components/EmpresaBar";
import Dashboard from "./components/Dashboard";
import PasoCard from "./components/PasoCard";
import ModalAyuda from "./components/ModalAyuda";

export default function App() {
  const empresa = useEmpresa();
  const [rol, setRol] = useState("responsable");
  const [modalAyuda, setModalAyuda] = useState(false);

  const storageKey = empresa ? `nom035_${empresa}` : null;

  const [datos, setDatosRaw] = useStorage(
    storageKey ? `${storageKey}_datos` : "__noop__",
    { nombre: "", trabajadores: "", responsable: "", fechaInicio: "" }
  );
  const [checklist, setChecklistRaw] = useStorage(
    storageKey ? `${storageKey}_checklist` : "__noop__",
    {}
  );
  const [notas, setNotasRaw] = useStorage(
    storageKey ? `${storageKey}_notas` : "__noop__",
    {}
  );
  const [comentarios, setComentariosRaw] = useStorage(
    storageKey ? `${storageKey}_comentarios` : "__noop__",
    {}
  );

  if (!empresa) return <Bienvenida />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      <Header
        rol={rol}
        setRol={setRol}
        empresa={empresa}
        onHelp={() => setModalAyuda(true)}
      />

      <EmpresaBar datos={datos} setDatos={setDatosRaw} rol={rol} />

      <main className="flex-1 pb-12">
        <Dashboard checklist={checklist} datos={datos} />

        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {PASOS.map((paso) => (
            <PasoCard
              key={paso.id}
              paso={paso}
              checklist={checklist}
              setChecklist={setChecklistRaw}
              notas={notas}
              setNotas={setNotasRaw}
              comentarios={comentarios}
              setComentarios={setComentariosRaw}
              rol={rol}
            />
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200 bg-white">
        Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.
        ·{" "}
        <a
          href="https://consentidohumano.com"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-gray-600"
        >
          consentidohumano.com
        </a>
      </footer>

      {modalAyuda && <ModalAyuda onClose={() => setModalAyuda(false)} />}
    </div>
  );
}
