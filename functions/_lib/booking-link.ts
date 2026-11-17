// Shared handler for the short booking links (/bookseb, /bookmagnus).
// Redirects to the calendar page whatever the query string is
// (the old exact-path Cloudflare rules only matched the bare path, so /bookseb?utm_source=x was a 404).
// A redirect never runs the site's PostHog script, so this sends one server-side event with the four campaign tags.
// Fails open: if PostHog is slow or down the visitor is still redirected.

// Public, write-only project key, the same one build.sh inlines into every page.
const POSTHOG_PROJECT_KEY = "phc_tfrEvZMAfNvPzmof6dHMndPEDuLe4wNdPDBTUJA66Zww";
const POSTHOG_CAPTURE_URL = "https://eu.i.posthog.com/capture/";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export const bookingLink =
  (calendarUrl: string): PagesFunction =>
  async (context) => {
    const { request } = context;
    const redirect = Response.redirect(calendarUrl, 302);
    // HEAD is link-preview and uptime probes, not a visit.
    if (request.method !== "GET") return redirect;

    const url = new URL(request.url);
    const properties: Record<string, string | boolean> = {
      $process_person_profile: false,
      $current_url: url.origin + url.pathname + url.search,
      $host: url.host,
      $pathname: url.pathname,
      $lib: "booking-link-redirect",
    };
    const referrer = request.headers.get("referer");
    if (referrer) properties.$referrer = referrer.slice(0, 500);
    for (const key of UTM_KEYS) {
      const value = url.searchParams.get(key);
      if (value) properties[key] = value.slice(0, 200);
    }

    context.waitUntil(
      fetch(POSTHOG_CAPTURE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_PROJECT_KEY,
          event: "booking_link_visited",
          distinct_id: crypto.randomUUID(),
          properties,
        }),
      }).catch(() => {}),
    );

    return redirect;
  };
