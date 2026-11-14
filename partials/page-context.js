// page-context.js: adds page_type and language to every PostHog event.
// Injected as the first script in <head> of every built page by build.sh, so
// window.maskinBeforeSend exists when posthog.init runs. build.sh also adds
// before_send: window.maskinBeforeSend to each init config.
//
// language  : the page's own <html lang>, reduced to the language code (en, da, sv).
// page_type : one fixed list. <meta name="page-type" content="..."> on the page wins.
//             Without the meta tag the type is derived from the URL path (rules below).
//
// Page types: home, hub, article, guide, documentation, landing_page, case,
//             comparison, changelog, legal, other
// Path rules: /                          home
//             /da/ /sv/ /docs/ /docs/learn/ /marketplace/ /alternatives/ /loops/   hub
//             /changelog/                changelog
//             /privacy/ /terms/          legal
//             /docs/learn/<page>/        guide
//             /docs/<page>/              documentation
//             /da/<page>/ /sv/<page>/ /loops/<page>/                              article
//             /alternatives/<page>/      comparison
//             /marketplace/<page>/ /solutions/<page>/ /small-business/ /onboarding/ /deck/   landing_page
//             anything else              other
(function () {
  "use strict";
  var TYPES = ["home", "hub", "article", "guide", "documentation", "landing_page", "case", "comparison", "changelog", "legal", "other"];

  function language() {
    var l = (document.documentElement.getAttribute("lang") || "en").toLowerCase().split("-")[0];
    return l || "en";
  }

  function pageType() {
    var m = document.querySelector('meta[name="page-type"]');
    var v = m && (m.getAttribute("content") || "").trim().toLowerCase();
    if (v && TYPES.indexOf(v) !== -1) return v;
    var p = location.pathname.replace(/\/index\.html$/, "/");
    if (p.charAt(p.length - 1) !== "/") p += "/";
    if (p === "/") return "home";
    var seg = p.split("/").filter(Boolean);
    var top = seg[0];
    if (top === "changelog") return "changelog";
    if (top === "privacy" || top === "terms") return "legal";
    if (top === "small-business" || top === "onboarding" || top === "deck" || top === "solutions") return "landing_page";
    if (top === "docs") {
      if (seg.length === 1) return "hub";
      if (seg[1] === "learn") return seg.length === 2 ? "hub" : "guide";
      return "documentation";
    }
    if (top === "da" || top === "sv" || top === "loops") return seg.length === 1 ? "hub" : "article";
    if (top === "alternatives") return seg.length === 1 ? "hub" : "comparison";
    if (top === "marketplace") return seg.length === 1 ? "hub" : "landing_page";
    return "other";
  }

  window.maskinBeforeSend = function (event) {
    if (event && event.properties) {
      if (event.properties.page_type == null) event.properties.page_type = pageType();
      if (event.properties.language == null) event.properties.language = language();
    }
    return event;
  };
})();
