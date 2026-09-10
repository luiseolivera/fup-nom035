import { useState, useRef } from "react";
import { importarConReintento } from "../utils/cargaDiferida";

const CONFIG = {
  ats: {
    etiqueta: "Cargar resultados de ATS (Excel)",
    ayuda: "Se genera el formato de verificación y la carta de canalización solo para quienes requieren atención clínica. La columna \"ÁREA\" del Excel debe traer la empresa/subsidiaria real del trabajador (se usa como \"Empresa:\" en el formato); el campo \"Área:\" queda en blanco.",
    procesar: (archivo) =>
      importarConReintento(() => import("../utils/generarFormatos")).then((m) =>
        m.procesarResultadosAts(archivo)
      ),
    resumenTexto: (r) => `${r.generados} de ${r.total} trabajadores requieren atención clínica — se generaron ${r.archivos} formatos.`,
    sinResultados: "Ningún trabajador requiere atención clínica según este archivo; no se generó ningún formato.",
    plantilla: "/plantillas/plantilla-resultados-ats.xlsx",
  },
  rps: {
    etiqueta: "Cargar resultados de RPS (Excel)",
    ayuda: "Se genera el formato de entrevista solo para quienes tienen nivel de riesgo Alto o Muy alto. La columna \"ÁREA\" del Excel debe traer la empresa/subsidiaria real del trabajador (se usa como \"Empresa:\" en el formato); el campo \"Área:\" queda en blanco.",
    procesar: (archivo) =>
      importarConReintento(() => import("../utils/generarFormatos")).then((m) =>
        m.procesarResultadosRps(archivo)
      ),
    resumenTexto: (r) => `${r.generados} de ${r.total} trabajadores tienen riesgo Alto o Muy alto — se generaron ${r.archivos} formatos.`,
    sinResultados: "Ningún trabajador tiene riesgo Alto o Muy alto según este archivo; no se generó ningún formato.",
    plantilla: "/plantillas/plantilla-resultados-rps.xlsx",
  },
};

export default function CargarResultados({ tipo, rol }) {
  const config = CONFIG[tipo];
  const inputRef = useRef(null);
  const [estado, setEstado] = useState("idle"); // idle | procesando | listo | error | vacio
  const [mensaje, setMensaje] = useState("");
  const editable = rol === "responsable" || rol === "consultor";

  if (!config) return null;

  async function handleFile(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setEstado("procesando");
    setMensaje("");
    try {
      const resumen = await config.procesar(archivo);
      if (resumen.generados === 0) {
        setEstado("vacio");
        setMensaje(config.sinResultados);
      } else {
        setEstado("listo");
        setMensaje(config.resumenTexto(resumen));
      }
    } catch (err) {
      console.error(`Error procesando resultados de ${tipo}:`, err);
      setEstado("error");
      setMensaje(
        err?.message
          ? `No se pudo procesar el archivo: ${err.message}`
          : "No se pudo procesar el archivo. Verifica que sea el Excel de resultados correcto."
      );
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-file-spreadsheet text-gray-400 text-base"></i>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {config.etiqueta}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{config.ayuda}</p>
      <a
        href={config.plantilla}
        download
        className="inline-flex items-center gap-1 text-xs font-medium hover:underline mb-3"
        style={{ color: "#1D3557" }}
      >
        <i className="ti ti-download text-sm"></i>
        Descargar plantilla de ejemplo (Excel)
      </a>

      {editable ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            disabled={estado === "procesando"}
            className="block w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:text-white file:bg-[#1D3557] disabled:opacity-60"
          />
          {estado === "procesando" && (
            <p className="text-xs mt-2 flex items-center gap-1.5 text-gray-500">
              <i className="ti ti-loader-2 text-sm"></i> Procesando archivo y generando formatos...
            </p>
          )}
          {estado === "listo" && (
            <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: "#15803d" }}>
              <i className="ti ti-circle-check text-sm"></i> {mensaje} Se descargó un ZIP con los formatos.
            </p>
          )}
          {estado === "vacio" && (
            <p className="text-xs mt-2 flex items-center gap-1.5 text-gray-500">
              <i className="ti ti-info-circle text-sm"></i> {mensaje}
            </p>
          )}
          {estado === "error" && (
            <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: "#dc2626" }}>
              <i className="ti ti-alert-circle text-sm"></i> {mensaje}
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-400 italic">Solo el responsable o el consultor pueden cargar este archivo.</p>
      )}
    </div>
  );
}
