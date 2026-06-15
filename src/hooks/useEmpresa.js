export function useEmpresa() {
  const params = new URLSearchParams(window.location.search);
  const empresa = params.get("empresa") || "";
  return empresa.trim().toLowerCase();
}
