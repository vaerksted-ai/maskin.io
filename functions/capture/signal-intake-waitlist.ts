// Cloudflare Pages Function: /capture/signal-intake-waitlist
// Email capture on /marketplace/signal-intake/ while the flow is not installable.
// Flow: validate -> consent check -> Turnstile verify -> Resend contact (no segment).
// Fails closed: with no RESEND_API_KEY or TURNSTILE_SECRET it returns 503 and stores nothing,
// and without consent=true nothing is stored. The wording version, source and consent time are stored on the contact.
// The contact is not added to a segment: the Resend plan has 3 segments, all in use. Filter on consent_source to find the list.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_VERSIONS = new Set(["consent-signal-intake-v2-2026-11-23"]);
const CONSENT_SOURCE = "signal-intake-waitlist";

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
  const consentVersion = typeof body.consent_version === "string" ? body.consent_version : "";
  const token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";

  if (!EMAIL_RE.test(email) || email.length > 254) return json({ ok: false, error: "invalid_email" }, 400);
  if (body.consent !== true || !CONSENT_VERSIONS.has(consentVersion)) return json({ ok: false, error: "consent_required" }, 400);

  const { RESEND_API_KEY, TURNSTILE_SECRET } = context.env;
  if (!RESEND_API_KEY || !TURNSTILE_SECRET) return json({ ok: false, error: "not_configured" }, 503);

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

  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      email,
      unsubscribed: false,
      properties: {
        consent_source: CONSENT_SOURCE,
        consent_time: new Date().toISOString(),
        consent_wording_version: consentVersion,
      },
    }),
  });
  // 409 means the address is already a contact: treat as done so the form never reveals who is on the list.
  if (!res.ok && res.status !== 409) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

// Minimal PagesFunction type, as in the other capture functions: the Cloudflare types are not installed in this static repo.
type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Promise<Response> | Response;
