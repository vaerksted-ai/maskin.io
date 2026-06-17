// Shared docs chrome + behaviour.
// Single source of truth for the top bar and sidebar nav, so no page duplicates them.
(function () {
  "use strict";

  // ── Navigation model (the docs IA) ──────────────────────────────
  var NAV = [
    { title: "Getting started", items: [
      { label: "Get started", href: "/docs/get-started/" },
      { label: "Self-hosted setup", href: "/docs/get-started/self-hosted/", nested: true },
      { label: "Quickstart tutorial", href: "/docs/quickstart/" }
    ]},
    { title: "Concepts", items: [
      { label: "Core concepts", href: "/docs/concepts/" },
      { label: "Agents & sessions", href: "/docs/agents/" },
      { label: "Architecture", href: "/docs/architecture/" }
    ]},
    { title: "Reference", items: [
      { label: "MCP tools", href: "/docs/mcp-tools/" },
      { label: "API reference", href: "/docs/api/" },
      { label: "Configuration", href: "/docs/configuration/" },
      { label: "Integrations", href: "/docs/integrations/" }
    ]},
    { title: "Self-hosting", items: [
      { label: "LLM & models", href: "/docs/llm/" },
      { label: "Production deployment", href: "/docs/deployment/" },
      { label: "Security", href: "/docs/security/" },
      { label: "Troubleshooting", href: "/docs/troubleshooting/" }
    ]}
  ];

  var LOGO = '<svg width="26" height="26" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect width="80" height="80" rx="14" fill="#111110"/>' +
    '<path d="M17 60 L17 20 L40 46 L63 20 L63 60" stroke="#FAFAF8" stroke-width="6" stroke-linecap="square" stroke-linejoin="miter" fill="none"/>' +
    '</svg>';

  var TOGGLE = '<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">' +
    '<svg class="theme-toggle__sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>' +
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
    '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' +
    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
    '<svg class="theme-toggle__moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>';

  function normalize(p) { return p.length > 1 && p.charAt(p.length - 1) !== "/" ? p + "/" : p; }

  function renderTopBar() {
    var el = document.getElementById("docnav");
    if (!el) return;
    // The top bar is now rendered statically into each page (so crawlers and
    // no-JS clients see it). Only fall back to JS rendering if it's empty.
    if (el.children.length) return;
    el.innerHTML =
      '<div class="wrap docnav__inner">' +
        '<a class="docnav__logo" href="/">' + LOGO + 'Maskin</a>' +
        '<span class="docnav__tag">Docs</span>' +
        '<span class="docnav__spacer"></span>' +
        '<ul class="docnav__links">' +
          '<li class="docnav__hide-sm"><a href="/">Home</a></li>' +
          '<li><a href="https://github.com/sindre-ai/maskin" target="_blank" rel="noopener">GitHub</a></li>' +
          '<li class="docnav__hide-sm"><a href="http://meshfirm.com/bookmagnus" target="_blank" rel="noopener">Book a meeting</a></li>' +
          '<li>' + TOGGLE + '</li>' +
        '</ul>' +
      '</div>';
  }

  function renderSidebar() {
    var el = document.getElementById("docsidebar");
    if (!el) return;
    // The sidebar is now rendered statically into each page (so crawlers and
    // no-JS clients see the full nav graph). Only fall back to JS rendering if
    // it's empty; the active state is already baked into the static markup.
    if (el.children.length) return;
    var here = normalize(window.location.pathname);
    var html = "";
    for (var g = 0; g < NAV.length; g++) {
      var grp = NAV[g];
      html += '<nav class="doc-sidebar__group" aria-label="' + grp.title + '">';
      html += '<p class="doc-sidebar__title">' + grp.title + "</p>";
      html += '<ul class="doc-sidebar__list">';
      for (var i = 0; i < grp.items.length; i++) {
        var it = grp.items[i];
        var cls = [];
        if (it.nested) cls.push("is-nested");
        if (it.soon) {
          html += "<li><span class=\"doc-sidebar__soon\">" + it.label + "</span></li>";
        } else {
          var active = normalize(it.href) === here;
          if (active) cls.push("is-active");
          html += '<li><a class="' + cls.join(" ") + '" href="' + it.href + '"' +
            (active ? ' aria-current="page"' : "") + ">" + it.label + "</a></li>";
        }
      }
      html += "</ul></nav>";
    }
    el.innerHTML = html;
  }

  function bindTheme() {
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");
    var stored;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    if (stored === "dark" || stored === "light") { root.setAttribute("data-theme", stored); }

    function effective() {
      var attr = root.getAttribute("data-theme");
      if (attr === "dark") return "dark";
      if (attr === "light") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (btn) {
      btn.addEventListener("click", function () {
        var next = effective() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }
  }

  function bindScroll() {
    var nav = document.getElementById("docnav");
    function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function init() {
    renderTopBar();
    renderSidebar();
    bindTheme();
    bindScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
