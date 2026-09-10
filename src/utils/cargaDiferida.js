// Cada despliegue genera archivos JS con nombres nuevos (contienen un hash
// del contenido). Si el usuario deja la página abierta mientras se publica
// una actualización, sus import() dinámicos (pdf-lib, xlsx, etc.) siguen
// apuntando a nombres de archivo que ya no existen en el servidor, y fallan
// con "Failed to fetch dynamically imported module". En vez de mostrar ese
// error críptico, se recarga la página una sola vez para traer la versión
// nueva; si el error persiste después de recargar, ya se deja pasar como
// error real (evita un bucle de recargas infinito).
const CLAVE_RECARGA = "nom035-recarga-por-actualizacion";

function esErrorDeModuloDesactualizado(err) {
  return /dynamically imported module|error loading dynamically imported module/i.test(
    err?.message || ""
  );
}

/**
 * Ejecuta una función que hace un import() dinámico. Si falla por una
 * versión desactualizada del bundle, recarga la página en vez de propagar
 * el error.
 */
export async function importarConReintento(cargarModulo) {
  try {
    return await cargarModulo();
  } catch (err) {
    if (esErrorDeModuloDesactualizado(err) && !sessionStorage.getItem(CLAVE_RECARGA)) {
      sessionStorage.setItem(CLAVE_RECARGA, "1");
      window.location.reload();
      // La página se está recargando; esta promesa nunca necesita resolver.
      return new Promise(() => {});
    }
    throw err;
  }
}

/** Llamar una vez que la app ya cargó bien, para permitir detectar la próxima actualización. */
export function marcarCargaExitosa() {
  sessionStorage.removeItem(CLAVE_RECARGA);
}
