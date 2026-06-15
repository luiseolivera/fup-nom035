import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const DEBOUNCE_MS = 800;

export function useSupabaseData(empresa) {
  const [datos, setDatosState] = useState({});
  const [checklist, setChecklistState] = useState({});
  const [notas, setNotasState] = useState({});
  const [comentarios, setComentariosState] = useState({});
  const [loading, setLoading] = useState(true);
  const timers = useRef({});

  // Load data on mount
  useEffect(() => {
    if (!empresa) return;
    supabase
      .from("nom035_seguimiento")
      .select("*")
      .eq("empresa", empresa)
      .maybeSingle()
      .then(({ data: row }) => {
        if (row) {
          setDatosState(row.datos || {});
          setChecklistState(row.checklist || {});
          setNotasState(row.notas || {});
          setComentariosState(row.comentarios || {});
        }
        setLoading(false);
      });
  }, [empresa]);

  function save(field, value) {
    clearTimeout(timers.current[field]);
    timers.current[field] = setTimeout(() => {
      supabase
        .from("nom035_seguimiento")
        .upsert({ empresa, [field]: value, updated_at: new Date().toISOString() }, { onConflict: "empresa" });
    }, DEBOUNCE_MS);
  }

  function setDatos(val) {
    const resolved = typeof val === "function" ? val(datos) : val;
    setDatosState(resolved);
    save("datos", resolved);
  }

  function setChecklist(val) {
    const resolved = typeof val === "function" ? val(checklist) : val;
    setChecklistState(resolved);
    save("checklist", resolved);
  }

  function setNotas(val) {
    const resolved = typeof val === "function" ? val(notas) : val;
    setNotasState(resolved);
    save("notas", resolved);
  }

  function setComentarios(val) {
    const resolved = typeof val === "function" ? val(comentarios) : val;
    setComentariosState(resolved);
    save("comentarios", resolved);
  }

  return {
    loading,
    datos, setDatos,
    checklist, setChecklist,
    notas, setNotas,
    comentarios, setComentarios,
  };
}
