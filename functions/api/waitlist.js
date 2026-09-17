// Cloudflare Pages Function — /api/waitlist (DEPRECATED forward shim).
//
// The canonical capture surface is /api/marketplace-email-capture. This route
// is kept alive for one release so live legacy callers get a response instead
// of a 404 while their pages are being rewired. It forwards to the canonical
// handler and relays that handler's status and body verbatim.
//
// The forward is a direct handler invocation rather than a same-origin fetch.
// A self-fetch has to resolve the request's own hostname from inside the
// worker, which fails whenever that host is not resolvable in the runtime
// (observed as a 502 when serving through a dev relay). Delegation has no
// network hop and behaves identically in dev, preview and production.
//
// It deliberately does NOT synthesise consent. A legacy caller that omits the
// consent field receives the canonical 400 (consent_required) — the same
// answer it would get posting to /api/marketplace-email-capture directly.
// Deprecation: flag for removal once no page in the repo posts here.

import { onRequestPost as capturePost } from "./marketplace-email-capture";

const LEGACY_SLUG_MAP = {
  // legacy workflow slugs -> canonical loop slugs
  "seo-publisher": "seo-publishing",
  "sales-loop": "outbound",
  "llm-knowledge-wiki": "knowledge-wiki",
  // already-canonical slugs pass through unchanged
  "seo-publishing": "seo-publishing",
  outbound: "outbound",
  "knowledge-wiki": "knowledge-wiki",
  "product-discovery": "product-discovery",
};

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const legacySlug =
    typeof body.loop === "string" && body.loop
      ? body.loop
      : typeof body.workflow === "string"
        ? body.workflow
        : "";

  const forwarded = {
    email: body.email,
    loop_slug: LEGACY_SLUG_MAP[legacySlug] || legacySlug,
    consent: body.consent === true,
    turnstile_token:
      typeof body.turnstile_token === "string" ? body.turnstile_token : "",
  };

  const upstream = await capturePost({
    ...context,
    request: new Request(
      new URL("/api/marketplace-email-capture", context.request.url),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(forwarded),
      },
    ),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      deprecation: "true",
      link: '</api/marketplace-email-capture>; rel="successor-version"',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}
