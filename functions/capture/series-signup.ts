// Cloudflare Pages Function: /capture/series-signup
// Sæt strøm til din forretning: series sign-up on /da/saet-stroem/.
// Flow: validate -> consent check -> Turnstile verify -> Resend contact in the series segment.
// Fails closed: with no RESEND_API_KEY or RESEND_SERIES_SEGMENT_ID it returns 503 and stores nothing.
// Consent is a ticked box on the page, covers only this series, and the sign-up text is the CPO-approved line.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEATS = new Set(["customer-value", "accounting-25nov", "content-2dec", "sales-9dec", "service-16dec"]);
const STAFF_BANDS = new Set(["1 til 10", "11 til 50", "51 til 250", "Over 250"]);

interface Env {
  RESEND_API_KEY?: string;
  RESEND_SERIES_SEGMENT_ID?: string;
  TURNSTILE_SECRET?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName = typeof body.first_name === "string" ? body.first_name.trim().slice(0, 100) : "";
  const company = typeof body.company === "string" ? body.company.trim().slice(0, 150) : "";
  const staffBand = typeof body.staff_band === "string" ? body.staff_band : "";
  const seats = Array.isArray(body.seats) ? body.seats.filter((s): s is string => typeof s === "string" && SEATS.has(s)) : [];
  const source = typeof body.source === "string" ? body.source.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) : "hub";
  const token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";

  if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: "invalid_email" }, 400);
  if (!firstName || !company || !STAFF_BANDS.has(staffBand) || seats.length === 0) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }
  if (body.consent !== true) return json({ ok: false, error: "consent_required" }, 400);

  const { RESEND_API_KEY, RESEND_SERIES_SEGMENT_ID, TURNSTILE_SECRET } = context.env;
  if (!RESEND_API_KEY || !RESEND_SERIES_SEGMENT_ID || !TURNSTILE_SECRET) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  const ip = context.request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const data = (await res.json()) as { success?: boolean };
    if (!token || !res.ok || data.success !== true) return json({ ok: false, error: "turnstile_failed" }, 400);
  } catch {
    return json({ ok: false, error: "turnstile_failed" }, 400);
  }

  // Resend contact properties (company, staff_band, seats, source, consent_at) must exist in Resend first.
  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      email,
      first_name: firstName,
      unsubscribed: false,
      segments: [{ id: RESEND_SERIES_SEGMENT_ID }],
      properties: { company, staff_band: staffBand, seats: seats.join(","), source, consent_at: new Date().toISOString() },
    }),
  });
  if (!res.ok) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
