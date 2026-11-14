// seo_cta_clicked: one named PostHog event for clicks on calls to action.
// Loaded on every built page by build.sh, after the PostHog snippet. Uses the
// existing posthog client: no second client, no autocapture, no recording, no
// visitor identifier. Properties are page_path, cta_type, cta_label and position.
//
// position says where on the page the link sits: the link's own data-position
// if it has one (top, bottom), else nav, footer or body. It lets a click on the
// top nav Book a meeting link be told apart from the page buttons.
//
// cta_type is read from the link target:
//   trial      /signup
//   book_call  /bookseb, meshfirm.com/bookmagnus, calendar.app.google
//   contact    mailto: links
//   demo       a /demo path
// The conversion for the SEO loop target is cta_type trial or book_call.
(function () {
  "use strict";

  function ctaType(a) {
    var href = a.getAttribute("href") || "";
    if (/^mailto:/i.test(href)) return "contact";
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    var host = u.hostname.replace(/^www\./, "");
    var path = u.pathname.replace(/\/+$/, "");
    if (host === "maskin.io" || host === location.hostname.replace(/^www\./, "")) {
      if (path === "/signup") return "trial";
      if (path === "/bookseb") return "book_call";
      if (path === "/demo" || path.indexOf("/demo/") === 0) return "demo";
    }
    if (host === "meshfirm.com" && path === "/bookmagnus") return "book_call";
    if (host === "calendar.app.google") return "book_call";
    return null;
  }

  function ctaPosition(a) {
    var own = a.getAttribute("data-position");
    if (own) return own;
    if (a.closest("nav, header")) return "nav";
    if (a.closest("footer")) return "footer";
    return "body";
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a || !window.posthog) return;
    var type = ctaType(a);
    if (!type) return;
    window.posthog.capture("seo_cta_clicked", {
      page_path: location.pathname,
      cta_type: type,
      cta_label: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      position: ctaPosition(a),
    }, { transport: "sendBeacon" });
  }, true);
})();
