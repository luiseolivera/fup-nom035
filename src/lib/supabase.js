import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pfwvspnyxkrcgvivmfcx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd3ZzcG55eGtyY2d2aXZtZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTQ3MzYsImV4cCI6MjA5NzEzMDczNn0.uSDe-ToZVZr46c_090MXwkkZdbis8tO4KEnhj0zhlPs";

// Algunos antivirus/proxies corporativos eliminan headers "sospechosos" como
// `apikey` de las peticiones salientes, lo que provoca errores tipo
// "No API key found in request" aunque el cliente sí lo esté enviando.
// Como respaldo, forzamos que la key también viaje como query param en la URL
// (formato soportado oficialmente por Supabase), que no suele ser filtrado.
function fetchConApiKeyDeRespaldo(input, init) {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (!url.searchParams.has("apikey")) {
    url.searchParams.set("apikey", SUPABASE_ANON_KEY);
  }
  return fetch(url.toString(), init);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: fetchConApiKeyDeRespaldo },
});
