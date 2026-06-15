import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";

async function upsertField(empresa, field, value) {
  await supabase
    .from("nom035_seguimiento")
    .upsert(
      { empresa, [field]: value, updated_at: new Date().toISOString() },
      { onConflict: "empresa" }
    );
}

export function useSupabaseData(empresa) {
  const [datos, setDatosState] = useState({});
  const [checklist, setChecklistState] = useState({});
  const [notas, setNotasState] = useState({});
  const [comentarios, setComentariosState] = useState({});
  const [loading, setLoading] = useState(true);
  const textTimers = useRef({});

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

  // Checklist: save immediately (binary toggle, no debounce needed)
  const setChecklist = useCallback((val) => {
    setChecklistState((prev) => {
      const resolved = typeof val === "function" ? val(prev) : val;
      upsertField(empresa, "checklist", resolved);
      return resolved;
    });
  }, [empresa]);

  // Text fields: debounce 1s to avoid too many requests while typing
  function makeTextSetter(stateSetter, field, stateRef) {
    return (val) => {
      stateSetter((prev) => {
        const resolved = typeof val === "function" ? val(prev) : val;
        clearTimeout(textTimers.current[field]);
        textTimers.current[field] = setTimeout(() => {
          upsertField(empresa, field, resolved);
        }, 1000);
        return resolved;
      });
    };
  }

  const setDatos = useCallback(makeTextSetter(setDatosState, "datos"), [empresa]);
  const setNotas = useCallback(makeTextSetter(setNotasState, "notas"), [empresa]);
  const setComentarios = useCallback(makeTextSetter(setComentariosState, "comentarios"), [empresa]);

  // Flush pending text saves before page unload
  useEffect(() => {
    function flush() {
      Object.values(textTimers.current).forEach(clearTimeout);
    }
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, []);

  return {
    loading,
    datos, setDatos,
    checklist, setChecklist,
    notas, setNotas,
    comentarios, setComentarios,
  };
}
