import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import PizZip from "pizzip";

const PLANTILLA_ATS_VERIFICACION = "/plantillas/formato-ats-verificacion.pdf";
const PLANTILLA_CANALIZACION = "/plantillas/formato-canalizacion.pdf";
const PLANTILLA_RPS_DOCX = "/plantillas/formato-entrevista-rps.docx";

function formatearFecha(date) {
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function limpiar(valor) {
  return (valor ?? "").toString().trim();
}

// Rango Unicode de marcas diacríticas combinantes (acentos sueltos tras NFD):
// U+0300 a U+036F. Se arma con String.fromCharCode para no depender de
// caracteres combinantes literales dentro del código fuente.
const DIACRITICOS = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);

function normalizar(valor) {
  return limpiar(valor)
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .toUpperCase();
}

/** Busca una columna en una fila de Excel por varios nombres posibles (tolerante a acentos/mayúsculas). */
function buscarColumna(fila, candidatos) {
  const claves = Object.keys(fila);
  for (const candidato of candidatos) {
    const clave = claves.find((k) => normalizar(k) === normalizar(candidato));
    if (clave !== undefined) return limpiar(fila[clave]);
  }
  return "";
}

function limpiarMotivos(motivos) {
  return limpiar(motivos)
    .split("\n")
    .map((s) => s.replace(/^[•\-\s]+/, "").trim())
    .filter(Boolean)
    .join(", ");
}

function envolverTexto(font, texto, size, maxWidth, maxLineas = 2) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const lineas = [];
  let actual = "";
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (font.widthOfTextAtSize(prueba, size) > maxWidth && actual) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = prueba;
    }
    if (lineas.length === maxLineas) break;
  }
  if (actual && lineas.length < maxLineas) lineas.push(actual);
  if (lineas.length === maxLineas) {
    const ultima = lineas[maxLineas - 1];
    while (font.widthOfTextAtSize(`${ultima}…`, size) > maxWidth && ultima.length > 1) {
      lineas[maxLineas - 1] = ultima.slice(0, -1);
    }
  }
  return lineas;
}

async function cargarPdf(url) {
  const bytes = await fetch(url).then((res) => {
    if (!res.ok) throw new Error(`No se pudo cargar la plantilla: ${url}`);
    return res.arrayBuffer();
  });
  return PDFDocument.load(bytes);
}

function dataUrlABytes(dataUrl) {
  const coma = dataUrl.indexOf(",");
  const base64 = dataUrl.slice(coma + 1);
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

/** Incrusta el logo (data URL PNG/JPEG) en el PDF; null si no hay logo o falla. */
async function incrustarLogo(pdfDoc, dataUrlLogo) {
  if (!dataUrlLogo) return null;
  try {
    const bytes = dataUrlABytes(dataUrlLogo);
    return dataUrlLogo.startsWith("data:image/png")
      ? await pdfDoc.embedPng(bytes)
      : await pdfDoc.embedJpg(bytes);
  } catch (err) {
    console.error("No se pudo incrustar el logo en el PDF:", err);
    return null;
  }
}

/**
 * Cubre el placeholder "LOGO DE LA EMPRESA" (esquina superior izquierda) y
 * dibuja ahí el logo real, si hay uno. Si no hay logo, simplemente deja el
 * texto de la plantilla tal cual (no se toca nada).
 */
function dibujarLogo(page, logoImage) {
  if (!logoImage) return;
  page.drawRectangle({ x: 83, y: 726, width: 300, height: 38, color: rgb(1, 1, 1) });
  const maxAncho = 160;
  const maxAlto = 34;
  const escala = Math.min(maxAncho / logoImage.width, maxAlto / logoImage.height, 1);
  const width = logoImage.width * escala;
  const height = logoImage.height * escala;
  page.drawImage(logoImage, { x: 88, y: 760 - height, width, height });
}

/**
 * Formato de Entrevista por Acontecimientos Traumáticos Severos (verificación ATS).
 * trabajador: { nombre, motivos }
 * "Empresa:" siempre es el nombre capturado en "Datos del centro de
 * trabajo" (no se usa ningún dato del Excel para esto). "Área:" y la
 * casilla "Requiere atención clínica" se dejan en blanco/sin marcar: eso
 * lo decide el entrevistador a mano, no se infiere automáticamente.
 */
export async function generarFormatoAtsVerificacion(trabajador, datosEmpresa) {
  const pdfDoc = await cargarPdf(PLANTILLA_ATS_VERIFICACION);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const size = 11;

  dibujarLogo(page, await incrustarLogo(pdfDoc, datosEmpresa?.logo));

  function reemplazarLinea(x, y, ancho, texto) {
    page.drawRectangle({ x: x - 2, y: y - 3, width: ancho, height: 15, color: rgb(1, 1, 1) });
    page.drawText(texto, { x, y, size, font, color: rgb(0, 0, 0) });
  }

  reemplazarLinea(90.03, 648.58, 300, `Fecha: ${formatearFecha(new Date())}`);
  reemplazarLinea(90.03, 633.95, 440, `Nombre del trabajador(a): ${trabajador.nombre}`);
  reemplazarLinea(90.03, 619.35, 300, `Empresa: ${datosEmpresa?.nombre || ""}`);

  // Motivo del Acontecimiento Traumático Severo. El espacio disponible entre
  // la etiqueta (y≈478) y el siguiente bloque "Marcar con una X..." (y≈429)
  // es angosto, así que se usan hasta 3 líneas en letra chica bien acotadas
  // para nunca invadir el texto de abajo.
  const motivo = limpiarMotivos(trabajador.motivos);
  if (motivo) {
    page.drawRectangle({ x: 88, y: 438, width: 436, height: 30, color: rgb(1, 1, 1) });
    const lineas = envolverTexto(font, motivo, 8, 432, 3);
    lineas.forEach((linea, i) => {
      page.drawText(linea, { x: 90.03, y: 459 - i * 8, size: 8, font, color: rgb(0, 0, 0) });
    });
  }

  return pdfDoc.save();
}

/**
 * Carta de canalización del trabajador.
 * trabajador: { nombre }
 */
export async function generarFormatoCanalizacion(trabajador, datosEmpresa) {
  const pdfDoc = await cargarPdf(PLANTILLA_CANALIZACION);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  dibujarLogo(page, await incrustarLogo(pdfDoc, datosEmpresa?.logo));

  // La coma que sigue al espacio en blanco original cae dentro de la zona
  // que se cubre con el rectángulo blanco, así que se redibuja como parte
  // del mismo texto en vez de dejarla huérfana.
  const texto = `${trabajador.nombre},`;
  const maxWidth = 145;
  let size = 10;
  while (font.widthOfTextAtSize(texto, size) > maxWidth && size > 6) size -= 0.5;

  page.drawRectangle({ x: 376, y: 474, width: 150, height: 14, color: rgb(1, 1, 1) });
  page.drawText(texto, { x: 380, y: 477.53, size, font, color: rgb(0, 0, 0) });

  return pdfDoc.save();
}

/**
 * Formato de Entrevista de Riesgos Psicosociales (DOCX).
 * trabajador: { nombre }
 * "Empresa:" es el nombre capturado en "Datos del centro de trabajo".
 * "Área:" se deja en blanco (sin ese dato) para llenarse a mano.
 */
export async function generarFormatoEntrevistaRps(trabajador, datosEmpresa) {
  const bytes = await fetch(PLANTILLA_RPS_DOCX).then((res) => {
    if (!res.ok) throw new Error("No se pudo cargar la plantilla del formato RPS.");
    return res.arrayBuffer();
  });

  const escaparXml = (s) =>
    limpiar(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const zip = new PizZip(bytes);
  let xml = zip.file("word/document.xml").asText();
  xml = xml.replace(
    "Fecha: ________________________",
    `Fecha: ${escaparXml(formatearFecha(new Date()))}`
  );
  xml = xml.replace(
    "Nombre del trabajador(a): ____________________________",
    `Nombre del trabajador(a): ${escaparXml(trabajador.nombre)}`
  );
  xml = xml.replace(
    "Empresa: ______________________",
    `Empresa: ${escaparXml(datosEmpresa?.nombre || "")}`
  );
  zip.file("word/document.xml", xml);

  return zip.generate({ type: "uint8array", compression: "DEFLATE" });
}

function nombreArchivo(prefijo, nombreTrabajador, extension) {
  const limpio = limpiar(nombreTrabajador).replace(/\s+/g, "-").toLowerCase() || "trabajador";
  return `${prefijo}-${limpio}.${extension}`;
}

async function crearZip(archivos) {
  const zip = new PizZip();
  archivos.forEach(({ nombre, bytes }) => zip.file(nombre, bytes));
  return zip.generate({ type: "uint8array", compression: "DEFLATE" });
}

function descargarBytes(bytes, nombreArchivo, tipoMime) {
  const blob = new Blob([bytes], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Procesa el Excel de resultados de ATS: genera el formato de verificación y,
 * para quienes requieren atención clínica, también la carta de canalización.
 * Descarga todo en un solo ZIP. Devuelve un resumen del procesamiento.
 */
export async function procesarResultadosAts(archivoExcel, datosEmpresa) {
  const XLSX = await import("xlsx");
  const bufer = await archivoExcel.arrayBuffer();
  const libro = XLSX.read(bufer, { type: "array" });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja, { defval: "" });

  if (filas.length === 0) {
    throw new Error("El archivo no tiene filas de datos.");
  }

  const trabajadores = filas
    .map((fila) => ({
      nombre: buscarColumna(fila, ["NOMBRE", "TRABAJADOR", "NOMBRE DEL TRABAJADOR"]),
      motivos: buscarColumna(fila, ["MOTIVOS", "MOTIVO"]),
      requiereAtencion: normalizar(
        buscarColumna(fila, [
          "¿REQUIERE ATENCIÓN CLÍNICA?",
          "REQUIERE ATENCION CLINICA",
          "REQUIERE ATENCIÓN CLÍNICA",
        ])
      ).startsWith("SI"),
    }))
    .filter((t) => t.nombre);

  const aCanalizar = trabajadores.filter((t) => t.requiereAtencion);

  if (aCanalizar.length === 0) {
    return { total: trabajadores.length, generados: 0, archivos: 0 };
  }

  const archivos = [];
  for (const trabajador of aCanalizar) {
    const verificacion = await generarFormatoAtsVerificacion(trabajador, datosEmpresa);
    archivos.push({ nombre: nombreArchivo("verificacion-ats", trabajador.nombre, "pdf"), bytes: verificacion });
    const canalizacion = await generarFormatoCanalizacion(trabajador, datosEmpresa);
    archivos.push({ nombre: nombreArchivo("canalizacion", trabajador.nombre, "pdf"), bytes: canalizacion });
  }

  const zipBytes = await crearZip(archivos);
  descargarBytes(zipBytes, "formatos-ats.zip", "application/zip");

  return { total: trabajadores.length, generados: aCanalizar.length, archivos: archivos.length };
}

/**
 * Procesa el Excel de resultados de RPS: genera el formato de entrevista para
 * quienes tienen nivel de riesgo Alto o Muy alto. Descarga todo en un ZIP.
 */
export async function procesarResultadosRps(archivoExcel, datosEmpresa) {
  const XLSX = await import("xlsx");
  const bufer = await archivoExcel.arrayBuffer();
  const libro = XLSX.read(bufer, { type: "array" });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja, { defval: "" });

  if (filas.length === 0) {
    throw new Error("El archivo no tiene filas de datos.");
  }

  const trabajadores = filas
    .map((fila) => ({
      nombre: buscarColumna(fila, ["NOMBRE", "TRABAJADOR", "NOMBRE DEL TRABAJADOR"]),
      nivel: normalizar(buscarColumna(fila, ["NIVEL DE RIESGO", "NIVEL", "RIESGO"])),
    }))
    .filter((t) => t.nombre);

  const conRiesgo = trabajadores.filter((t) => t.nivel === "ALTO" || t.nivel === "MUY ALTO");

  if (conRiesgo.length === 0) {
    return { total: trabajadores.length, generados: 0, archivos: 0 };
  }

  const archivos = [];
  for (const trabajador of conRiesgo) {
    const docx = await generarFormatoEntrevistaRps(trabajador, datosEmpresa);
    archivos.push({ nombre: nombreArchivo("entrevista-rps", trabajador.nombre, "docx"), bytes: docx });
  }

  const zipBytes = await crearZip(archivos);
  descargarBytes(zipBytes, "formatos-rps.zip", "application/zip");

  return { total: trabajadores.length, generados: conRiesgo.length, archivos: archivos.length };
}
