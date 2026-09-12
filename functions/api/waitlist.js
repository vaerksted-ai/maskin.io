// Cloudflare Pages Function — captures workflow waitlist signups.
// Head of Growth: swap the console.log for a real destination (Airtable,
// Notion, Postmark, whatever the growth stack chooses) before the first
// video drops.
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const workflow = typeof body.workflow === "string" ? body.workflow : "unknown";
    const source = typeof body.source === "string" ? body.source : "";
    if (!email || email.indexOf("@") < 1) {
      return json({ ok: false, error: "invalid_email" }, 400);
    }
    // Surface to Cloudflare Pages Function logs until a real destination is wired.
    console.log(JSON.stringify({
      type: "workflow_waitlist_signup",
      email,
      workflow,
      source,
      ts: new Date().toISOString(),
    }));
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: "bad_request" }, 400);
  }
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
