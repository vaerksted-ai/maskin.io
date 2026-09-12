// Cloudflare Pages Function — /api/marketplace-email-capture
// Reverses ADR-002 (first server-side surface on maskin.io) — CTO deliverability-
// verdict'd at bet [Public Marketplace](https://maskin.io/e2877e32-2c11-489e-96c8-a76200908ed4/objects/69573594-fa90-4385-a43a-3908279ddf26).
// Flow: Turnstile verify -> KV dedupe on sha256(email) -> Resend send -> 200.
// Returns 400 on validation failure, 200 idempotent on dedupe hit, 400 on consent=false.

const KNOWN_LOOP_SLUGS = new Set([
  "seo-publishing",
  "outbound",
  "knowledge-wiki",
  "product-discovery",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CaptureBody {
  email?: unknown;
  loop_slug?: unknown;
  consent?: unknown;
  turnstile_token?: unknown;
}

interface Env {
  MARKETPLACE_CAPTURE_KV?: KVNamespace;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  TURNSTILE_SECRET?: string;
  MARKETPLACE_CAPTURE_ALLOW_INSECURE?: string;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CaptureBody;
  try {
    body = (await context.request.json()) as CaptureBody;
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const loop_slug = typeof body.loop_slug === "string" ? body.loop_slug : "";
  const consent = body.consent === true;
  const turnstile_token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }
  if (!KNOWN_LOOP_SLUGS.has(loop_slug)) {
    return json({ ok: false, error: "invalid_loop_slug" }, 400);
  }
  if (!consent) {
    return json({ ok: false, error: "consent_required" }, 400);
  }

  const allowInsecure = context.env.MARKETPLACE_CAPTURE_ALLOW_INSECURE === "1";

  const turnstileOk = await verifyTurnstile(
    turnstile_token,
    context.env.TURNSTILE_SECRET,
    getClientIp(context.request),
    allowInsecure,
  );
  if (!turnstileOk) {
    return json({ ok: false, error: "turnstile_failed" }, 400);
  }

  const emailHash = await sha256Hex(email);
  const kv = context.env.MARKETPLACE_CAPTURE_KV;

  if (kv) {
    const existing = await kv.get(`email:${emailHash}`);
    if (existing) {
      return json({ ok: true, dedupe: true });
    }
  }

  const resendOk = await sendResendConfirmation(
    email,
    loop_slug,
    context.env.RESEND_API_KEY,
    context.env.RESEND_FROM,
    allowInsecure,
  );
  if (!resendOk) {
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  if (kv) {
    await kv.put(
      `email:${emailHash}`,
      JSON.stringify({ loop_slug, ts: new Date().toISOString() }),
    );
  }

  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });

async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  remoteip: string,
  allowInsecure: boolean,
): Promise<boolean> {
  if (!secret) {
    // Env var not yet configured in Cloudflare Pages — accept in preview / local
    // dev only when the operator has opted in with MARKETPLACE_CAPTURE_ALLOW_INSECURE=1.
    return allowInsecure;
  }
  if (!token) return false;

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteip) form.append("remoteip", remoteip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendResendConfirmation(
  email: string,
  loop_slug: string,
  apiKey: string | undefined,
  from: string | undefined,
  allowInsecure: boolean,
): Promise<boolean> {
  if (!apiKey) {
    return allowInsecure;
  }
  const sender = from || "Maskin <ai@maskin.io>";
  const subject = `You're on the list for the ${prettyLoopName(loop_slug)} loop`;
  const text = [
    `Thanks for signing up. We'll email you the moment the ${prettyLoopName(loop_slug)} loop walkthrough drops.`,
    "",
    "— The Maskin team",
    "",
    "Reply STOP to unsubscribe.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [email],
        subject,
        text,
        headers: {
          "List-Unsubscribe": "<mailto:unsubscribe@maskin.io>",
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function prettyLoopName(slug: string): string {
  switch (slug) {
    case "seo-publishing":
      return "SEO publishing";
    case "outbound":
      return "outbound";
    case "knowledge-wiki":
      return "LLM knowledge wiki";
    case "product-discovery":
      return "product discovery";
    default:
      return slug;
  }
}

function getClientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") || "";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

// Minimal PagesFunction type — the Cloudflare types aren't installed in this
// static repo and adding @cloudflare/workers-types just for type help would add
// a dependency the deploy pipeline doesn't need.
type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Promise<Response> | Response;
