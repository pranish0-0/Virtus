import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

const ALLOWED_ORIGINS = [
  "https://virtusengineering.com.np",
  "https://www.virtusengineering.com.np",
  "http://localhost",
  "http://127.0.0.1",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.find((o) => origin.startsWith(o)) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    // ── CORS preflight ──
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    }

    try {
      const { email } = await request.json();

      // Validate
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return new Response(JSON.stringify({ error: "Invalid email address" }), {
          status: 400,
          headers: { ...corsHeaders(request), "Content-Type": "application/json" },
        });
      }

      const subscriberEmail = email.trim();
      const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" });

      // Build MIME message
      const msg = createMimeMessage();
      msg.setSender({ name: "Virtus Engineering Website", addr: "noreply@virtusengineering.com.np" });
      msg.setRecipient("virtus.engineeringco@gmail.com");
      msg.setSubject(`🔔 New Subscriber: ${subscriberEmail}`);
      msg.addMessage({
        contentType: "text/html",
        data: `
          <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#0F2A44;margin-bottom:8px;">New Newsletter Subscriber</h2>
            <hr style="border:1px solid #0D9488;margin:12px 0;">
            <p><strong>Email:</strong> ${subscriberEmail}</p>
            <p><strong>Subscribed at:</strong> ${timestamp} (NPT)</p>
            <p style="color:#666;font-size:13px;margin-top:24px;">
              This notification was sent from the Virtus Engineering coming soon page.
            </p>
          </div>
        `,
      });

      const message = new EmailMessage(
        "noreply@virtusengineering.com.np",
        "virtus.engineeringco@gmail.com",
        msg.asRaw()
      );

      await env.SEND_EMAIL.send(message);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Subscribe error:", err);
      return new Response(JSON.stringify({ error: "Failed to process subscription", detail: err.message }), {
        status: 500,
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    }
  },
};
