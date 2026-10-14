#!/usr/bin/env node
// Language switcher injector. Runs from build.sh over all of dist, after the content copy and
// the PostHog, Turnstile and CTA steps. Node 18 or later, zero dependencies.
//
//   node scripts_inject_switcher.mjs [dist-dir] [--manifest <i18n.json>]
//
// Nothing is edited by hand: the English pages never change in git, the switcher only exists in
// dist. A language shows only when its nav flag is true; the page's own language always shows
// as the current item (a span with aria-current). Fewer than 2 items renders nothing.
// Spec: "maskin.io site: tech spec for Danish and Swedish pages", section 7b, and the language
// switcher spec Rev 2. Exit 1 when a page that needs an anchor does not have it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LANG_ORDER = ['en', 'da', 'sv'];
const NAMES = { en: 'English', da: 'Dansk', sv: 'Svenska' };
const CODES = { en: 'EN', da: 'DA', sv: 'SV' };
const GROUP_LABEL = { en: 'Language', da: 'Sprog', sv: 'Språk' };

const DOCS_ANCHOR = '<li><button class="theme-toggle"';
const HOME_DESKTOP_ANCHOR = '<li><a class="nav__login"';
const GITHUB_LI = /<li>(<a href="https:\/\/github\.com\/sindre-ai\/maskin"[^>]*>GitHub<\/a>)<\/li>/;
const DOCNAV_BLOCK = /<nav\b[^>]*class="[^"]*\bdocnav\b[^"]*"[\s\S]*?<\/nav>/;

// Homepage only: index.html has its own inline CSS and does not load docs.css, so the build adds
// this block when (and only when) the switcher renders there. It also moves the hamburger
// breakpoint from 600px to 960px (the design spec's breakpoint): at 601 to 860px the seven links
// plus the switcher overflow or wrap, measured. Keep in step with the LANGUAGE
// SWITCHER section of docs/docs.css.
const HOME_CSS = `<style id="lang-switcher-css">
.lang{display:inline-flex;align-items:center;gap:2px;border:1px solid var(--rule);border-radius:6px;padding:2px}
.lang__item{display:inline-flex;align-items:center;font-size:.8rem;line-height:1.2;padding:.2rem .5rem;border-radius:4px;color:var(--ink-2);white-space:nowrap}
.nav__links a.lang__item{font-size:.8rem;font-weight:400;color:var(--ink-2)}
.nav__links a.lang__item:hover{color:var(--ink);background:var(--linen);text-decoration:none}
.nav__links a.lang__item:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.lang__item[aria-current="true"]{color:var(--ink)!important;background:var(--linen);font-weight:600}
.lang__code{display:none;font-family:var(--ff-mono);font-size:.68rem;font-weight:500;letter-spacing:.04em}
.nav__drawer .lang-drawer__group{display:block}
.nav__drawer .lang-drawer__label{display:block;padding:1rem 0 .25rem;font-family:var(--ff-mono);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)}
.nav__drawer .lang-drawer .lang__item{display:block;padding:.75rem 0;border-radius:0;font-size:1.125rem;font-weight:600;color:var(--ink)}
.nav__drawer .lang-drawer a.lang__item:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.nav__drawer .lang-drawer .lang__item[aria-current="true"]{background:none;color:var(--accent)!important}
@media(max-width:960px){.nav__links{display:none}.nav__mobile-actions{display:flex}.nav__hamburger{display:flex}}
</style>`;

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function parseAttrs(s) {
  const out = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(s))) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? '';
  return out;
}

function pageLang(html) {
  const m = html.match(/<html\b([^>]*)>/i);
  return (m && parseAttrs(m[1]).lang) || 'en';
}

// hreflang -> pathname, from the head alternates only.
function headAlternates(html) {
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [''])[0].replace(/<!--[\s\S]*?-->/g, '');
  const out = {};
  for (const m of head.matchAll(/<link\b([^>]*)>/gi)) {
    const a = parseAttrs(m[1]);
    if (!/(^|\s)alternate(\s|$)/i.test(a.rel || '') || !a.hreflang || !a.href) continue;
    const p = a.href.replace(/^https?:\/\/(www\.)?maskin\.io(?=[/?#]|$)/i, '').split('#')[0].split('?')[0] || '/';
    if (p.startsWith('/')) out[a.hreflang.toLowerCase()] = p;
  }
  return out;
}

// Items for one page: [{ lang, current, href }]. English is always a candidate; da and sv only
// when their nav flag is true; the page's own language always shows.
export function switcherItems(html, manifest) {
  const languages = manifest.languages || {};
  const own = pageLang(html);
  const alternates = headAlternates(html);
  const items = [];
  for (const lang of LANG_ORDER) {
    const current = lang === own;
    if (!current && lang !== 'en' && languages[lang]?.nav !== true) continue;
    if (current) { items.push({ lang, current: true }); continue; }
    const href = alternates[lang] ?? (lang === 'en' ? '/' : languages[lang]?.hub ?? `/${lang}/`);
    items.push({ lang, current: false, href });
  }
  return { own, items: items.length >= 2 ? items : [] };
}

function itemMarkup(it) {
  const name = NAMES[it.lang];
  const inner = (hideCode) => `<span class="lang__full">${name}</span><span class="lang__code"${hideCode ? ' aria-hidden="true"' : ''}>${CODES[it.lang]}</span>`;
  // The current item is not a link, so its code is not hidden from screen readers: below 560px
  // the full name is display:none and the code is all there is to announce.
  if (it.current) return `<span class="lang__item" lang="${it.lang}" aria-current="true">${inner(false)}</span>`;
  return `<a class="lang__item" lang="${it.lang}" hreflang="${it.lang}" href="${attr(it.href)}" aria-label="${name}">${inner(true)}</a>`;
}

export function barMarkup(own, items) {
  return `<li><div class="lang" role="group" aria-label="${GROUP_LABEL[own] ?? GROUP_LABEL.en}" data-lang-switcher>${items.map(itemMarkup).join('')}</div></li>`;
}

// Homepage drawer: plain rows, like every other drawer link.
export function drawerMarkup(own, items) {
  const rows = items.map((it) => (it.current
    ? `<span class="lang__item" lang="${it.lang}" aria-current="true">${NAMES[it.lang]}</span>`
    : `<a class="lang__item" lang="${it.lang}" hreflang="${it.lang}" href="${attr(it.href)}">${NAMES[it.lang]}</a>`)).join('');
  const label = GROUP_LABEL[own] ?? GROUP_LABEL.en;
  return `<li class="lang-drawer"><div class="lang-drawer__group" role="group" aria-label="${label}" data-lang-switcher><span class="lang-drawer__label" aria-hidden="true">${label}</span>${rows}</div></li>`;
}

const insertBefore = (s, needle, text) => { const i = s.indexOf(needle); return s.slice(0, i) + text + s.slice(i); };

// Pure per-page step. kind is 'docs' or 'home'. Returns { html, changed } or throws on a missing anchor.
export function injectPage(html, kind, manifest) {
  if (html.includes('data-lang-switcher')) return { html, changed: false };
  const { own, items } = switcherItems(html, manifest);
  if (!items.length) return { html, changed: false };
  const bar = barMarkup(own, items);
  if (kind === 'docs') {
    const m = html.match(DOCNAV_BLOCK);
    if (!m || !m[0].includes(DOCS_ANCHOR)) throw new Error('docs-shell page has no theme-toggle li to anchor on');
    let nav = insertBefore(m[0], DOCS_ANCHOR, bar);
    nav = nav.replace(GITHUB_LI, '<li class="docnav__hide-sm">$1</li>');
    // The section tag (Docs, Alternatives, ...) next to the logo also has to go at 560px and
    // below, or the bar overflows at 375 (measured). docs.css hides .docnav__tag.docnav__hide-sm.
    nav = nav.replace('<span class="docnav__tag">', '<span class="docnav__tag docnav__hide-sm">');
    // Tighter link gap at 560px and below, only where the switcher renders (the 360px fallback
    // from the design spec: the bar needs 365px with the default gap). See docs.css.
    nav = nav.replace('<ul class="docnav__links">', '<ul class="docnav__links docnav__links--lang">');
    return { html: html.slice(0, m.index) + nav + html.slice(m.index + m[0].length), changed: true };
  }
  // homepage
  const linksAt = html.search(/<ul\b[^>]*class="[^"]*\bnav__links\b[^"]*"/);
  const loginAt = linksAt < 0 ? -1 : html.indexOf(HOME_DESKTOP_ANCHOR, linksAt);
  if (loginAt < 0) throw new Error('homepage has no nav__login li in ul.nav__links to anchor on');
  const drawerAt = html.search(/<nav\b[^>]*id="navDrawer"/);
  const drawerEnd = drawerAt < 0 ? -1 : html.indexOf('</ul>', drawerAt);
  if (drawerEnd < 0) throw new Error('homepage has no ul inside nav#navDrawer to anchor on');
  let out = html.slice(0, drawerEnd) + drawerMarkup(own, items) + html.slice(drawerEnd);
  out = out.slice(0, loginAt) + bar + out.slice(loginAt);
  const headEnd = out.indexOf('</head>');
  if (headEnd < 0) throw new Error('homepage has no </head> to add the switcher CSS before');
  out = out.slice(0, headEnd) + HOME_CSS + '\n' + out.slice(headEnd);
  return { html: out, changed: true };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// skip entries are page keys: "changelog" skips changelog/index.html, "404.html" skips that file.
const pageKey = (rel) => (rel.endsWith('/index.html') ? rel.slice(0, -'/index.html'.length) : rel);

export function injectDist(distDir, manifest) {
  const skip = new Set(Array.isArray(manifest.switcher_skip) ? manifest.switcher_skip : []);
  const errors = [];
  let injected = 0;
  let unchanged = 0;
  let skipped = 0;
  for (const file of walk(distDir).sort()) {
    const rel = path.relative(distDir, file).split(path.sep).join('/');
    if (skip.has(pageKey(rel))) { skipped++; continue; }
    const html = fs.readFileSync(file, 'utf8');
    const kind = rel === 'index.html' ? 'home' : /<nav\b[^>]*class="[^"]*\bdocnav\b/.test(html) ? 'docs' : null;
    if (!kind) { errors.push(`${rel}: no docnav and not in switcher_skip, add the page to switcher_skip or give it a nav`); continue; }
    try {
      const r = injectPage(html, kind, manifest);
      if (r.changed) { fs.writeFileSync(file, r.html); injected++; } else unchanged++;
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
  }
  return { errors, injected, unchanged, skipped };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const mi = argv.indexOf('--manifest');
  const manifestPath = mi >= 0 ? argv[mi + 1] : path.join(path.dirname(fileURLToPath(import.meta.url)), 'i18n.json');
  const distDir = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--manifest') ?? 'dist';
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) {
    console.error(`inject-switcher FAILED: cannot read ${manifestPath}: ${e.message}`);
    process.exit(1);
  }
  if (!fs.existsSync(distDir)) { console.error(`inject-switcher FAILED: ${distDir} does not exist`); process.exit(1); }
  const { errors, injected, unchanged, skipped } = injectDist(distDir, manifest);
  for (const e of errors) console.error(`inject-switcher: ${e}`);
  if (errors.length) { console.error(`inject-switcher FAILED: ${errors.length} page(s)`); process.exit(1); }
  console.log(`inject-switcher ok, ${injected} page(s) with a switcher, ${unchanged} without, ${skipped} skipped`);
}
