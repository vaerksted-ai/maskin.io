// Shared client wiring for every /marketplace/<slug>/ loop landing page.
// Fires two PostHog events. No page collects an email.
//
// Events (PostHog must never see the legacy `workflow_slug` /
// `marketplace_workflow_page_view` names):
//   marketplace_loop_page_view       { loop_slug, referrer_source }                  on load
//   marketplace_loop_install_pressed { loop_slug, referrer_source, install_position } on Install click
//
// Contract with the page HTML (the two installable loops only):
//   <a data-install-link data-install-slug="<slug>" href="/install/<app slug>">
//     inside <div data-loop-install="<slug>" data-install-position="top|bottom">
//   <script src="/marketplace-events.js" defer></script>
// The click is not cancelled: the link opens the app's install page as normal.

(() => {
  function normalizeReferrer(ref) {
    if (!ref) return "direct";
    var host;
    try {
      host = new URL(ref).hostname.toLowerCase();
    } catch (e) {
      return "other";
    }
    if (
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtu.be"
    ) {
      return "youtube";
    }
    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
      return "linkedin";
    }
    return "other";
  }

  function pageLoopSlug() {
    // Second path segment (e.g. /marketplace/outbound/ -> outbound).
    var parts = location.pathname.split("/").filter(Boolean);
    var candidate = parts[1] || parts[0] || "";
    return candidate;
  }

  function capture(name, props) {
    if (typeof window.posthog === "undefined" || !window.posthog.capture)
      return;
    window.posthog.capture(name, props);
  }

  function firePageView() {
    var loop_slug = pageLoopSlug();
    if (!loop_slug) return;
    capture("marketplace_loop_page_view", {
      loop_slug: loop_slug,
      referrer_source: normalizeReferrer(document.referrer),
    });
  }

  function onInstallClick(e) {
    var link = e.target.closest
      ? e.target.closest("a[data-install-link]")
      : null;
    if (!link) return;
    var wrap = link.closest("[data-loop-install]");
    capture("marketplace_loop_install_pressed", {
      loop_slug: link.getAttribute("data-install-slug") || pageLoopSlug(),
      referrer_source: normalizeReferrer(document.referrer),
      install_position:
        (wrap && wrap.getAttribute("data-install-position")) || "unknown",
    });
  }

  function init() {
    firePageView();
    document.addEventListener("click", onInstallClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
