// Cloudflare Pages Function: /capture/series-signup
// Sæt strøm til din forretning: series sign-up on /da/saet-stroem/.
// Flow: validate -> consent check -> Turnstile verify -> Resend contact in the series segment.
// Does one thing: adds a contact to the saet-stroem-series segment. Reuses the RESEND_API_KEY the email capture already uses.
// Fails closed: with no RESEND_API_KEY or TURNSTILE_SECRET it returns 503 and stores nothing, and without consent=true it stores nothing.
// Consent is an unticked box ticked by the person, covers only this series, and the wording version is stored with the consent time.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEATS = new Set(["customer-value", "accounting-25nov", "content-2dec", "sales-9dec", "service-16dec"]);
const SERIES_SEGMENT_ID = "dbeb1ee8-2392-490e-8a21-16a64e9d26f4";
const CONSENT_VERSIONS = new Set(["consent-v1-2026-11-13"]);
const STAFF_BANDS = new Set(["1 til 10", "11 til 50", "51 til 250", "Over 250"]);

interface Env {
  RESEND_API_KEY?: string;
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
  const consentVersion = typeof body.consent_version === "string" ? body.consent_version : "";
  const token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";

  if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: "invalid_email" }, 400);
  if (!firstName || !company || !STAFF_BANDS.has(staffBand) || seats.length === 0) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }
  if (body.consent !== true || !CONSENT_VERSIONS.has(consentVersion)) return json({ ok: false, error: "consent_required" }, 400);

  const { RESEND_API_KEY, TURNSTILE_SECRET } = context.env;
  if (!RESEND_API_KEY || !TURNSTILE_SECRET) {
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

  // Resend contact properties (company, staff_band, series_seats, consent_source, consent_time, consent_wording_version) must exist in Resend first.
  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      email,
      first_name: firstName,
      unsubscribed: false,
      segments: [{ id: SERIES_SEGMENT_ID }],
      properties: { company, staff_band: staffBand, series_seats: seats.join(","), consent_source: source, consent_time: new Date().toISOString(), consent_wording_version: consentVersion },
    }),
  });
  if (!res.ok) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
