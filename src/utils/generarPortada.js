import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Copia local de la plantilla (mismo origen: evita problemas de CORS con S3).
const PLANTILLA_URL = "/plantillas/portada-enc.pdf";

function formatearFecha(date) {
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Genera la portada del reporte de encuestas (portada-enc.pdf) rellenada
 * con los datos del centro de trabajo ya capturados en la app:
 * nombre de la empresa, responsable de seguimiento y fecha de generación.
 * Devuelve los bytes del PDF resultante.
 */
export async function generarPortadaPdf(datos = {}) {
  const bytes = await fetch(PLANTILLA_URL).then((res) => {
    if (!res.ok) throw new Error("No se pudo cargar la plantilla del reporte.");
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(bytes);
  const page = pdfDoc.getPages()[0];
  const pageWidth = page.getWidth();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const nombreEmpresa = (datos.nombre || "").trim();
  const responsable = (datos.responsable || "").trim();

  // 1. Título "NOMBRE DE LA EMPRESA" → nombre real, centrado, ajustando el
  // tamaño de letra si el nombre es muy largo para no salirse de la página.
  if (nombreEmpresa) {
    const texto = nombreEmpresa.toUpperCase();
    const maxWidth = pageWidth - 130;
    let size = 22;
    while (fontBold.widthOfTextAtSize(texto, size) > maxWidth && size > 10) {
      size -= 1;
    }
    const width = fontBold.widthOfTextAtSize(texto, size);

    // Cubrir el placeholder original con un rectángulo blanco.
    page.drawRectangle({
      x: 60,
      y: 625,
      width: pageWidth - 120,
      height: 32,
      color: rgb(1, 1, 1),
    });
    page.drawText(texto, {
      x: (pageWidth - width) / 2,
      y: 632.86,
      size,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }

  // 2. "Fecha del reporte: ___" → fecha de hoy. Se cubre el renglón
  // original completo (etiqueta + línea en blanco) y se redibuja entero,
  // así no depende de calcular dónde termina la etiqueta original.
  const sizeFecha = 11;
  page.drawRectangle({ x: 165, y: 234, width: 280, height: 16, color: rgb(1, 1, 1) });
  page.drawText(`Fecha del reporte: ${formatearFecha(new Date())}`, {
    x: 167.78,
    y: 238.61,
    size: sizeFecha,
    font,
    color: rgb(0, 0, 0),
  });

  // 3. "Responsable de la aplicación de las encuestas:" → nombre capturado,
  // en el renglón de abajo (la etiqueta ocupa casi todo el ancho de la hoja).
  if (responsable) {
    page.drawText(responsable, {
      x: 135.98,
      y: 168,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  return pdfDoc.save();
}

/** Genera la portada y dispara la descarga en el navegador. */
export async function descargarPortadaPdf(datos) {
  const pdfBytes = await generarPortadaPdf(datos);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const nombreArchivo = datos?.nombre
    ? `portada-encuestas-${datos.nombre.trim().replace(/\s+/g, "-").toLowerCase()}.pdf`
    : "portada-enc.pdf";
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
