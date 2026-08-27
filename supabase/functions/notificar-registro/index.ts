import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Credenciales SMTP de AWS SES (las mismas que usa Supabase Auth para el
// código de verificación). Se configuran como secrets de esta función:
//   supabase secrets set SES_SMTP_HOST=... SES_SMTP_USER=... SES_SMTP_PASS=...
const SES_SMTP_HOST = Deno.env.get("SES_SMTP_HOST")!;
const SES_SMTP_USER = Deno.env.get("SES_SMTP_USER")!;
const SES_SMTP_PASS = Deno.env.get("SES_SMTP_PASS")!;
const SES_SENDER_EMAIL = Deno.env.get("SES_SENDER_EMAIL") || "info@crese.org";
const NOTIFY_EMAIL = "info@crese.org";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const { nombre_empresa, nombre_persona, puesto, whatsapp, correo, empresa } = await req.json();

  const html = `
    <h2 style="color:#1D3557">Nuevo registro en NOM-035</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Empresa (ID)</td><td style="padding:8px">${empresa}</td></tr>
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Nombre empresa</td><td style="padding:8px">${nombre_empresa || "—"}</td></tr>
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Nombre</td><td style="padding:8px">${nombre_persona}</td></tr>
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Puesto</td><td style="padding:8px">${puesto || "—"}</td></tr>
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Correo</td><td style="padding:8px">${correo}</td></tr>
      <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">WhatsApp</td><td style="padding:8px">${whatsapp}</td></tr>
    </table>
  `;

  const client = new SMTPClient({
    connection: {
      hostname: SES_SMTP_HOST,
      port: 587,
      tls: false, // SES usa STARTTLS en el puerto 587, no TLS implícito
      auth: {
        username: SES_SMTP_USER,
        password: SES_SMTP_PASS,
      },
    },
  });

  try {
    await client.send({
      from: `NOM-035 CRESE <${SES_SENDER_EMAIL}>`,
      to: NOTIFY_EMAIL,
      subject: `Nuevo registro: ${nombre_empresa || empresa}`,
      content: "auto",
      html,
    });
    await client.close();
  } catch (err) {
    console.error("Error enviando notificación de registro:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
});
