import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

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

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "NOM-035 CRESE", email: "luisolivera@crese.org" },
      to: [{ email: "luisolivera@crese.org", name: "Luis Olivera" }],
      subject: `Nuevo registro: ${nombre_empresa || empresa}`,
      htmlContent: `
        <h2 style="color:#1D3557">Nuevo registro en NOM-035</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Empresa (ID)</td><td style="padding:8px">${empresa}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Nombre empresa</td><td style="padding:8px">${nombre_empresa || "—"}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Nombre</td><td style="padding:8px">${nombre_persona}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Puesto</td><td style="padding:8px">${puesto || "—"}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">Correo</td><td style="padding:8px">${correo}</td></tr>
          <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold">WhatsApp</td><td style="padding:8px">${whatsapp}</td></tr>
        </table>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
});
