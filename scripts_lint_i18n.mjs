#!/usr/bin/env node
// i18n lint for the Danish and Swedish pages. Node 18 or later, zero dependencies.
// Exit 1 on any error, 0 otherwise.
//
// A manifest page may carry "hidden": true (kept serving, hidden from search): L7 then needs it absent
// from the sitemap, L13 needs a noindex robots meta, and L11 does not ask for an llms.txt line.
//
// Source mode (default): checks L1 to L18 (L14 retired), warnings W1 and W2. Reads i18n.json, da/**, sv/**,
// root index.html, sitemap.xml, llms.txt, build.sh and _redirects.
//
//   node scripts_lint_i18n.mjs [--root <dir>] [--no-git] [--today YYYY-MM-DD]
//
// --no-git skips the warnings (W1 needs git history, W2 is CI-only noise in the build).
//
// Dist mode: checks D1 to D5 on the rendered dist/ after build.sh has injected the switcher.
//
//   node scripts_lint_i18n.mjs --dist [<dist-dir>] [--root <dir>]
//
// Spec: "maskin.io site: tech spec for Danish and Swedish pages", sections 4 and 7.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://maskin.io';
const LANGS = ['da', 'sv'];
const SLUG_RE = /^\/(da|sv)\/([a-z0-9]+(-[a-z0-9]+)*\/)?$/;
// Spec pattern, with the trailing word boundary made Unicode-aware: a plain \b treats the
// Danish ae/oe/aa letters as non-word, so "§ 10 kræver" would read as a price in kr.
const PRICE_RE = /(\$|€|£)\s?\d|\d\s?(kr\.?|SEK|DKK|EUR|USD)(?![\p{L}\p{N}])/u;
// Live pieces needed (besides the hub) before a language may show in header, nav or switcher.
const NAV_MIN_PAGES = { da: 2, sv: 1 };
// How llms.txt names each language section (heading must contain one of these words).
const LLMS_HEADING = { da: /\b(dansk|danish|da)\b/i, sv: /\b(svenska|swedish|sv)\b/i };

// ---------------------------------------------------------------- file helpers

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const read = (p) => (isFile(p) ? fs.readFileSync(p, 'utf8') : null);

function walk(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------- html helpers

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function parseAttrs(s) {
  const attrs = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(s))) attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? '');
  return attrs;
}

function tags(html, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
  let m;
  while ((m = re.exec(html))) out.push(parseAttrs(m[1]));
  return out;
}

// Comments, plain scripts and styles removed; JSON-LD scripts are kept.
function clean(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b(?![^>]*ld\+json)[\s\S]*?<\/script>/gi, '');
}

function jsonLdBlocks(html) {
  const out = [];
  const re = /<script\b[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html.replace(/<!--[\s\S]*?-->/g, '')))) out.push(m[1]);
  return out;
}

function visibleText(html) {
  const c = clean(html);
  const ld = jsonLdBlocks(html).join(' ');
  return decodeEntities(c.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ')) + ' ' + ld;
}

const relTokens = (a) => (a.rel || '').toLowerCase().split(/\s+/);

function anchorHrefs(html, within) {
  const src = within ?? clean(html);
  const out = [];
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(src))) {
    const a = parseAttrs(m[1]);
    if (a.href !== undefined) out.push(a.href);
  }
  return out;
}

// Internal pathname for an href, or null when external, empty or not a path.
function internalPath(href) {
  let h = href.trim();
  if (!h || h.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(h)) return null;
  if (/^https?:\/\//i.test(h)) {
    if (!/^https?:\/\/(www\.)?maskin\.io(?=[/?#]|$)/i.test(h)) return null;
    h = h.replace(/^https?:\/\/(www\.)?maskin\.io/i, '') || '/';
  }
  if (!h.startsWith('/') || h.startsWith('//')) return null;
  h = h.split('#')[0].split('?')[0];
  try { h = decodeURI(h); } catch { /* keep raw */ }
  return h || '/';
}

// ---------------------------------------------------------------- lint

export function lint(opts = {}) {
  const root = path.resolve(opts.root ?? path.dirname(fileURLToPath(import.meta.url)));
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const useGit = opts.git !== false;
  const errors = [];
  const warnings = [];
  const err = (id, where, msg) => errors.push({ id, where, msg });
  const warn = (id, where, msg) => warnings.push({ id, where, msg });
  const abs = (p) => path.join(root, p);
  const pageFile = (p) => abs(path.posix.join(p, 'index.html'));

  // ---- L1 manifest
  const raw = read(abs('i18n.json'));
  let manifest;
  if (raw === null) {
    err('L1', 'i18n.json', 'i18n.json is missing');
    return { errors, warnings, pageCount: 0 };
  }
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    err('L1', 'i18n.json', `i18n.json does not parse: ${e.message}`);
    return { errors, warnings, pageCount: 0 };
  }
  const languages = manifest.languages && typeof manifest.languages === 'object' ? manifest.languages : {};
  const groups = manifest.groups && typeof manifest.groups === 'object' ? manifest.groups : {};
  const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
  const banned = Array.isArray(manifest.banned) ? manifest.banned : [];
  if (!manifest.languages || !Array.isArray(manifest.pages)) {
    err('L1', 'i18n.json', 'manifest needs a languages object and a pages array');
  }
  for (const lang of Object.keys(languages)) {
    const l = languages[lang];
    if (!LANGS.includes(lang)) err('L1', 'i18n.json', `unknown language "${lang}"`);
    for (const k of ['locale', 'hub']) {
      if (typeof l[k] !== 'string' || !l[k]) err('L1', 'i18n.json', `language ${lang} needs a ${k}`);
    }
    for (const k of ['enabled', 'nav']) {
      if (typeof l[k] !== 'boolean') err('L1', 'i18n.json', `language ${lang} needs a boolean ${k}`);
    }
  }
  const byPath = new Map();
  for (const p of pages) {
    const where = p.path || '(page without path)';
    if (typeof p.path !== 'string' || !p.path) { err('L1', where, 'page entry has no path'); continue; }
    if (byPath.has(p.path)) err('L1', p.path, 'page is listed twice in the manifest');
    byPath.set(p.path, p);
    if (!languages[p.lang]) err('L1', p.path, `page lang "${p.lang}" is not a declared language`);
    else if (!p.path.startsWith(`/${p.lang}/`)) err('L1', p.path, `page lang "${p.lang}" does not match its folder`);
    if (!['native', 'twin'].includes(p.kind)) err('L1', p.path, 'kind must be native or twin');
    if (p.hidden !== undefined && typeof p.hidden !== 'boolean') err('L1', p.path, 'hidden must be a boolean');
    if (!isFile(pageFile(p.path))) err('L1', p.path, `${path.posix.join(p.path, 'index.html')} does not exist`);
  }
  const live = pages.filter((p) => typeof p.path === 'string' && isFile(pageFile(p.path)));
  for (const lang of LANGS) {
    for (const f of walk(abs(lang))) {
      if (path.basename(f) !== 'index.html') continue;
      const urlPath = '/' + path.relative(root, path.dirname(f)).split(path.sep).join('/') + '/';
      if (!byPath.has(urlPath)) err('L1', urlPath, 'page exists on disk but is not in the manifest');
    }
  }

  // ---- L2 language folders
  const build = read(abs('build.sh'));
  let contentDirs = [];
  const cd = build && build.match(/CONTENT_DIRS=\(([^)]*)\)/);
  if (!cd) err('L2', 'build.sh', 'CONTENT_DIRS array not found in build.sh');
  else contentDirs = cd[1].split(/\s+/).filter(Boolean);
  if (cd) {
    for (const lang of LANGS) {
      if (isDir(abs(lang)) && !contentDirs.includes(lang)) {
        err('L2', lang, `folder ${lang}/ exists but ${lang} is not in CONTENT_DIRS (silent 404)`);
      }
    }
    for (const [lang, l] of Object.entries(languages)) {
      if (!l.enabled) continue;
      if (!contentDirs.includes(lang)) err('L2', lang, `language ${lang} is enabled but not in CONTENT_DIRS`);
      if (!isDir(abs(lang))) err('L2', lang, `language ${lang} is enabled but ${lang}/ is not on disk`);
    }
    for (const d of contentDirs) {
      if (LANGS.includes(d) && !languages[d]) err('L2', d, `CONTENT_DIRS lists ${d} but the manifest does not declare it`);
    }
  }

  // ---- per-page reads
  const html = new Map();
  for (const p of live) html.set(p.path, read(pageFile(p.path)));
  const redirects = new Set();
  for (const line of (read(abs('_redirects')) || '').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    redirects.add(t.split(/\s+/)[0]);
  }
  // Paths served by a production redirect that is not in this repo (the booking link).
  const externalPaths = new Set(Array.isArray(manifest.external_paths) ? manifest.external_paths : []);
  const resolves = (p) => {
    if (externalPaths.has(p)) return true;
    if (redirects.has(p) || redirects.has(p.endsWith('/') ? p.slice(0, -1) : p + '/')) return true;
    const rel = p.replace(/^\//, '');
    if (isFile(abs(rel)) && !p.endsWith('/')) return true;
    if (isFile(abs(path.posix.join(rel, 'index.html')))) return true;
    if (!p.endsWith('/') && isFile(abs(rel + '.html'))) return true;
    return false;
  };
  const canonicalOf = (p) => ORIGIN + p;

  // ---- L3 language tags (manifest pages, plus the English home)
  const rootHtml = read(abs('index.html'));
  if (rootHtml !== null) {
    const m = rootHtml.match(/<html\b([^>]*)>/i);
    const lang = m ? parseAttrs(m[1]).lang : undefined;
    if (lang !== 'en') err('L3', '/', `root index.html has html lang "${lang ?? ''}", expected "en"`);
  }
  for (const p of live) {
    const h = html.get(p.path);
    const m = h.match(/<html\b([^>]*)>/i);
    const lang = m ? parseAttrs(m[1]).lang : undefined;
    if (lang !== p.lang) err('L3', p.path, `html lang is "${lang ?? ''}", expected "${p.lang}"`);
    const loc = languages[p.lang]?.locale;
    const og = tags(clean(h), 'meta').filter((a) => a.property === 'og:locale');
    if (og.length !== 1 || og[0].content !== loc) {
      err('L3', p.path, `og:locale must appear once and equal "${loc}"`);
    }
  }

  // ---- L4 head basics (and W2)
  for (const p of live) {
    const h = clean(html.get(p.path));
    const titles = [...h.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    if (titles.length !== 1 || !decodeEntities(titles[0][1]).trim()) {
      err('L4', p.path, 'needs exactly one non-empty title');
    }
    const descs = tags(h, 'meta').filter((a) => (a.name || '').toLowerCase() === 'description');
    if (descs.length !== 1 || !(descs[0].content || '').trim()) {
      err('L4', p.path, 'needs exactly one non-empty meta description');
    } else {
      const len = Array.from(descs[0].content).length;
      if (len > 170) err('L4', p.path, `meta description is ${len} characters, maximum is 170`);
      if (len < 70 && useGit) warn('W2', p.path, `meta description is ${len} characters, under 70`);
    }
    const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    if (h1s.length !== 1 || !h1s[0][1].replace(/<[^>]+>/g, '').trim()) {
      err('L4', p.path, 'needs exactly one non-empty h1');
    }
  }

  // ---- L5 canonical
  for (const p of live) {
    const h = clean(html.get(p.path));
    const canon = tags(h, 'link').filter((a) => relTokens(a).includes('canonical'));
    const want = canonicalOf(p.path);
    if (canon.length !== 1) { err('L5', p.path, `needs exactly one canonical, found ${canon.length}`); continue; }
    if (canon[0].href !== want) err('L5', p.path, `canonical is "${canon[0].href}", expected "${want}"`);
    const ogu = tags(h, 'meta').filter((a) => a.property === 'og:url');
    if (ogu.length !== 1 || ogu[0].content !== canon[0].href) {
      err('L5', p.path, 'og:url must appear once and equal the canonical');
    }
  }

  // ---- L6 hreflang
  const hreflangs = (h) => tags(clean(h), 'link')
    .filter((a) => relTokens(a).includes('alternate') && a.hreflang !== undefined);
  const groupPaths = new Set();
  for (const [name, members] of Object.entries(groups)) {
    const entries = Object.entries(members);
    for (const [, mp] of entries) groupPaths.add(mp);
    const liveMembers = entries.filter(([, mp]) => isFile(pageFile(mp)));
    // A group with fewer than two pages on disk has not shipped yet (the hub and the English
    // home head edit land in the same PR), so there is nothing to compare.
    if (liveMembers.length < 2) continue;
    const expected = new Map(entries.map(([lg, mp]) => [lg, canonicalOf(mp)]));
    expected.set('x-default', ORIGIN + '/');
    for (const [lg, mp] of entries) {
      if (!isFile(pageFile(mp))) err('L6', mp, `group ${name} lists ${lg} at ${mp} but that page does not exist`);
    }
    for (const [lg, mp] of liveMembers) {
      const h = read(pageFile(mp));
      const found = hreflangs(h);
      const seen = new Map();
      for (const a of found) {
        if (seen.has(a.hreflang)) err('L6', mp, `hreflang "${a.hreflang}" appears more than once`);
        seen.set(a.hreflang, a.href);
      }
      for (const [code, href] of expected) {
        if (!seen.has(code)) err('L6', mp, `group ${name}: missing hreflang "${code}" (${lg} page must list every member and x-default)`);
        else if (seen.get(code) !== href) err('L6', mp, `hreflang "${code}" is "${seen.get(code)}", expected "${href}"`);
      }
      for (const code of seen.keys()) {
        if (!expected.has(code)) err('L6', mp, `group ${name}: unexpected hreflang "${code}"`);
      }
    }
  }
  for (const p of live) {
    if (groupPaths.has(p.path)) continue;
    if (hreflangs(html.get(p.path)).length) err('L6', p.path, 'page is in no twin group but carries hreflang links');
  }

  // ---- L7 sitemap
  const sm = read(abs('sitemap.xml'));
  const smLocs = [];
  if (sm === null) err('L7', 'sitemap.xml', 'sitemap.xml is missing');
  else {
    if (!wellFormedXml(sm)) err('L7', 'sitemap.xml', 'sitemap.xml is not well formed XML');
    const seen = new Set();
    for (const m of sm.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const locs = [...m[1].matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)].map((x) => x[1]);
      const mods = [...m[1].matchAll(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/g)].map((x) => x[1]);
      if (locs.length !== 1) { err('L7', 'sitemap.xml', `a url entry has ${locs.length} loc elements`); continue; }
      const loc = decodeEntities(locs[0]);
      smLocs.push(loc);
      if (seen.has(loc)) err('L7', loc, 'url appears more than once in the sitemap');
      seen.add(loc);
      if (mods.length !== 1) err('L7', loc, `url has ${mods.length} lastmod elements, needs exactly one`);
      else if (!/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/.test(mods[0]) || Number.isNaN(Date.parse(mods[0]))) {
        err('L7', loc, `lastmod "${mods[0]}" is not a valid date`);
      } else if (mods[0].slice(0, 10) > today) {
        err('L7', loc, `lastmod "${mods[0]}" is in the future`);
      }
    }
    for (const p of pages) {
      if (typeof p.path !== 'string') continue;
      const n = smLocs.filter((l) => l === canonicalOf(p.path)).length;
      // A hidden page keeps serving but is out of the sitemap on purpose (see L13).
      const want = p.hidden === true ? 0 : 1;
      if (n !== want) err('L7', p.path, `manifest page appears ${n} times in the sitemap, needs exactly ${want === 0 ? 'zero (hidden)' : 'once'}`);
    }
    for (const loc of smLocs) {
      const m = loc.match(/^https:\/\/maskin\.io(\/(?:da|sv)\/.*)$/);
      if (!m) continue;
      if (!byPath.has(m[1])) err('L7', loc, 'da or sv sitemap url has no manifest entry');
      else if (!isFile(pageFile(m[1]))) err('L7', loc, 'da or sv sitemap url has no file');
    }
  }

  // ---- L8 links (and the link graph for L9)
  const links = new Map(); // page path -> Set of internal pathnames
  for (const p of live) {
    const set = new Set();
    for (const href of anchorHrefs(html.get(p.path))) {
      const ip = internalPath(href);
      if (ip === null) continue;
      set.add(ip);
      if (!resolves(ip)) { err('L8', p.path, `internal link ${ip} does not resolve to a file or redirect`); continue; }
      for (const other of LANGS) {
        if (other === p.lang || !(ip.startsWith(`/${other}/`) || ip === `/${other}`)) continue;
        const hub = languages[other]?.hub ?? `/${other}/`;
        if (ip !== hub) err('L8', p.path, `${p.lang} page links to ${ip}; other Nordic languages may only be linked via their hub ${hub}`);
      }
    }
    links.set(p.path, set);
  }

  // ---- L9 reachability
  for (const lang of Object.keys(languages)) {
    const langPages = live.filter((p) => p.lang === lang);
    const all = pages.filter((p) => p.lang === lang);
    if (all.length < 2) continue;
    const hub = languages[lang].hub;
    if (!isFile(pageFile(hub))) { err('L9', hub, `${lang} has ${all.length} pages but hub ${hub} does not exist`); continue; }
    const hubLinks = new Set();
    for (const href of anchorHrefs(read(pageFile(hub)))) { const ip = internalPath(href); if (ip) hubLinks.add(ip); }
    for (const p of langPages) {
      if (p.path === hub) continue;
      if (!hubLinks.has(p.path)) err('L9', hub, `hub does not link to ${p.path}`);
      if (!links.get(p.path).has(hub)) err('L9', p.path, `page does not link back to hub ${hub}`);
    }
    if (all.length >= 3) {
      const sources = new Map(langPages.map((p) => [p.path, links.get(p.path)]));
      sources.set(hub, hubLinks);
      for (const p of langPages) {
        let n = 0;
        for (const [src, set] of sources) if (src !== p.path && set.has(p.path)) n++;
        if (n < 2) err('L9', p.path, `page has ${n} in-language inbound links, needs at least 2`);
      }
    }
  }

  // ---- L10 JSON-LD
  for (const p of live) {
    const nodes = [];
    let parsed = true;
    for (const block of jsonLdBlocks(html.get(p.path))) {
      try { flattenLd(JSON.parse(block), nodes); } catch (e) { parsed = false; err('L10', p.path, `JSON-LD block does not parse: ${e.message}`); }
    }
    if (!parsed || !nodes.length) continue;
    const langs = nodes.filter((n) => n.inLanguage !== undefined);
    if (!langs.length) err('L10', p.path, 'no JSON-LD node carries inLanguage');
    for (const n of langs) {
      if (n.inLanguage !== p.lang) err('L10', p.path, `JSON-LD inLanguage is "${n.inLanguage}", expected "${p.lang}"`);
    }
    for (const n of nodes.filter((x) => [].concat(x['@type']).includes('BreadcrumbList'))) {
      const items = [...(n.itemListElement || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      const last = items.at(-1);
      const target = last && (typeof last.item === 'string' ? last.item : last.item?.['@id'] ?? last.item?.url);
      if (target !== canonicalOf(p.path)) err('L10', p.path, `last BreadcrumbList item is "${target ?? ''}", expected the canonical`);
    }
  }

  // ---- L11 llms.txt
  const llms = read(abs('llms.txt'));
  for (const lang of Object.keys(languages)) {
    const lp = live.filter((p) => p.lang === lang && p.hidden !== true);
    if (lp.length < 3) continue;
    if (llms === null) { err('L11', 'llms.txt', 'llms.txt is missing'); continue; }
    const section = llmsSection(llms, LLMS_HEADING[lang]);
    if (section === null) { err('L11', 'llms.txt', `llms.txt has no section heading for ${lang}`); continue; }
    for (const p of lp) {
      if (!section.includes(canonicalOf(p.path))) err('L11', p.path, `not listed in the ${lang} section of llms.txt`);
    }
  }
  if (llms !== null) {
    for (const m of llms.matchAll(/https:\/\/maskin\.io(\/(?:da|sv)\/[^\s)<>\]"']*)/g)) {
      const u = m[1].replace(/[.,;:]+$/, '');
      if (!resolves(u)) err('L11', u, 'URL listed in llms.txt does not exist as a file');
    }
  }

  // ---- L12 banned strings and prices
  const bannedRes = banned.map((b) => [b, new RegExp(`(?<![\\p{L}\\p{N}])${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu')]);
  for (const p of live) {
    const text = visibleText(html.get(p.path));
    for (const [b, re] of bannedRes) if (re.test(text)) err('L12', p.path, `contains banned string "${b}"`);
    const price = text.match(PRICE_RE);
    if (price) err('L12', p.path, `contains a price pattern "${price[0]}"`);
  }

  // ---- L13 draft leftovers
  for (const p of live) {
    const h = html.get(p.path);
    if (/\bTODO\b/.test(h)) err('L13', p.path, 'contains TODO');
    if (/\blorem\b/i.test(h)) err('L13', p.path, 'contains lorem ipsum');
    if (/href\s*=\s*["']#["']/i.test(clean(h))) err('L13', p.path, 'contains href="#"');
    const robots = tags(clean(h), 'meta').filter((a) => ['robots', 'googlebot'].includes((a.name || '').toLowerCase()));
    const noindexed = robots.some((a) => /noindex/i.test(a.content || ''));
    if (p.hidden === true) {
      if (!noindexed) err('L13', p.path, 'is hidden in the manifest but has no noindex robots meta');
    } else if (noindexed) err('L13', p.path, 'has a noindex robots meta');
  }

  // ---- L15 keywords
  for (const lang of Object.keys(languages)) {
    const seen = new Map();
    for (const p of pages.filter((x) => x.lang === lang)) {
      const k = String(p.keyword || '').trim().toLowerCase();
      if (!k) continue;
      if (seen.has(k)) err('L15', p.path, `keyword "${p.keyword}" is already used by ${seen.get(k)}`);
      else seen.set(k, p.path);
    }
  }

  // ---- L16 slugs
  for (const p of pages) {
    if (typeof p.path === 'string' && !SLUG_RE.test(p.path)) err('L16', p.path, 'path does not match the slug rule');
  }

  // ---- L17 nav flag consistency
  const shipped = [];
  for (const f of readdirRootHtml(root)) shipped.push(f);
  for (const d of contentDirs) for (const f of walk(abs(d))) if (f.endsWith('.html')) shipped.push(f);
  const navScan = shipped.map((f) => ({ rel: path.relative(root, f).split(path.sep).join('/'), blocks: navBlocks(fs.readFileSync(f, 'utf8')) }));
  for (const [lang, l] of Object.entries(languages)) {
    const hubOk = isFile(pageFile(l.hub));
    const others = live.filter((p) => p.lang === lang && p.path !== l.hub);
    if (l.nav === false) {
      for (const { rel, blocks } of navScan) {
        if (rel.startsWith(`${lang}/`)) continue; // a language's own pages may link to themselves
        const hit = blocks.flatMap(anchorHrefsOf).map(internalPath).find((ip) => ip && (ip === `/${lang}` || ip.startsWith(`/${lang}/`)));
        if (hit) err('L17', rel, `header, nav, drawer or switcher links to ${hit} while ${lang}.nav is false`);
      }
    } else if (l.nav === true) {
      if (!l.enabled) err('L17', lang, `${lang}.nav is true but the language is not enabled`);
      if (!hubOk) err('L17', lang, `${lang}.nav is true but hub ${l.hub} does not exist`);
      if (others.length < NAV_MIN_PAGES[lang]) {
        err('L17', lang, `${lang}.nav is true but only ${others.length} live page(s) besides the hub, needs ${NAV_MIN_PAGES[lang]}`);
      }
    }
  }

  // ---- L18 404 pages
  for (const lang of LANGS) {
    const f404 = abs(`${lang}/404.html`);
    if (!isFile(f404)) continue;
    const h = read(f404);
    const c = clean(h);
    if (tags(c, 'meta').some((a) => (a['http-equiv'] || '').toLowerCase() === 'refresh')) {
      err('L18', `${lang}/404.html`, 'has a meta refresh');
    }
    if (smLocs.some((s) => /\/404(\.html|\/)?$/.test(s) && s.includes(`/${lang}/`))) err('L18', `${lang}/404.html`, 'is listed in the sitemap');
    if (pages.some((p) => /404/.test(p.path || '') && (p.path || '').startsWith(`/${lang}/`))) err('L18', `${lang}/404.html`, 'is listed in the manifest pages');
    const hub = languages[lang]?.hub ?? `/${lang}/`;
    const hubLinked = anchorHrefs(h).map(internalPath).includes(hub);
    if (hubLinked && !languages[lang]?.enabled) err('L18', `${lang}/404.html`, `links to hub ${hub} while ${lang} is not enabled`);
  }

  // ---- W1 stale twins (needs full git history)
  if (useGit && !isShallow(root)) {
    for (const p of pages) {
      if (p.kind !== 'twin' || !p.follows || !p.checked_on) continue;
      const src = path.posix.join(p.follows, 'index.html').replace(/^\//, '');
      const last = gitDate(root, src);
      if (last && last > p.checked_on) warn('W1', p.path, `English source ${p.follows} changed ${last}, after checked_on ${p.checked_on}`);
    }
  }

  return { errors, warnings, pageCount: pages.length };
}

// ---------------------------------------------------------------- dist lint

// Switcher groups carry data-lang-switcher (div, no nested divs). Items carry class lang__item.
function switcherGroups(h) {
  const out = [];
  for (const m of clean(h).matchAll(/<div\b([^>]*\bdata-lang-switcher\b[^>]*)>([\s\S]*?)<\/div>/gi)) {
    const items = [];
    for (const t of m[2].matchAll(/<(a|span)\b([^>]*)>/gi)) {
      const a = parseAttrs(t[2]);
      if ((a.class || '').split(/\s+/).includes('lang__item')) items.push({ tag: t[1].toLowerCase(), attrs: a });
    }
    out.push({ html: m[0], items });
  }
  return out;
}

export function lintDist(opts = {}) {
  const root = path.resolve(opts.root ?? path.dirname(fileURLToPath(import.meta.url)));
  const dist = path.resolve(opts.dist ?? path.join(root, 'dist'));
  const errors = [];
  const err = (id, where, msg) => errors.push({ id, where, msg });
  const rootOf = (p) => path.join(dist, p.replace(/^\//, ''));
  const resolvesInDist = (p) => {
    if (p === '/') return isFile(path.join(dist, 'index.html'));
    if (!p.endsWith('/') && isFile(rootOf(p))) return true;
    if (isFile(path.join(rootOf(p), 'index.html'))) return true;
    return !p.endsWith('/') && isFile(rootOf(p) + '.html');
  };

  let manifest;
  try { manifest = JSON.parse(read(path.join(root, 'i18n.json'))); } catch (e) {
    err('L1', 'i18n.json', `i18n.json is missing or does not parse: ${e.message}`);
    return { errors, pageCount: 0, switcherCount: 0 };
  }
  if (!isDir(dist)) {
    err('D5', 'dist', 'dist/ does not exist, run build.sh first');
    return { errors, pageCount: 0, switcherCount: 0 };
  }
  const languages = manifest.languages && typeof manifest.languages === 'object' ? manifest.languages : {};
  const pages = Array.isArray(manifest.pages) ? manifest.pages : [];

  const files = walk(dist).filter((f) => f.endsWith('.html'));
  let switcherCount = 0;
  for (const f of files) {
    const rel = path.relative(dist, f).split(path.sep).join('/');
    const h = fs.readFileSync(f, 'utf8');

    for (const g of switcherGroups(h)) {
      switcherCount++;
      // D1 every switcher href resolves to a file in dist
      for (const it of g.items) {
        if (it.tag !== 'a') continue;
        const ip = internalPath(it.attrs.href ?? '');
        if (ip === null || !resolvesInDist(ip)) err('D1', rel, `switcher link "${it.attrs.href ?? ''}" does not resolve to a file in dist`);
      }
      // D3 never fewer than 2 items
      if (g.items.length < 2) err('D3', rel, `switcher group has ${g.items.length} item(s), needs at least 2`);
      // D4 exactly one current item, and it is a span
      const current = g.items.filter((it) => it.attrs['aria-current'] !== undefined);
      if (current.length !== 1) err('D4', rel, `switcher group has ${current.length} aria-current items, needs exactly 1`);
      else if (current[0].tag !== 'span') err('D4', rel, 'the aria-current switcher item is a link, it must be a span');
    }

    // D2 flag gate on rendered output: same scan as L17, but on dist (sees the injected links)
    const blocks = [...navBlocks(h), ...switcherGroups(h).map((g) => g.html)];
    for (const [lang, l] of Object.entries(languages)) {
      if (l.nav !== false || rel.startsWith(`${lang}/`)) continue; // a language's own pages may link to themselves
      const hit = blocks.flatMap(anchorHrefsOf).map(internalPath).find((ip) => ip && (ip === `/${lang}` || ip.startsWith(`/${lang}/`)));
      if (hit) err('D2', rel, `header, nav, drawer or switcher links to ${hit} while ${lang}.nav is false`);
    }
  }

  // D5 every manifest page exists in dist, and the English home keeps its canonical
  for (const p of pages) {
    if (typeof p.path === 'string' && !isFile(path.join(rootOf(p.path), 'index.html'))) {
      err('D5', p.path, `${path.posix.join(p.path, 'index.html')} is missing from dist (silent 404)`);
    }
  }
  const home = read(path.join(dist, 'index.html'));
  const homeCanon = home === null ? [] : tags(clean(home), 'link').filter((a) => relTokens(a).includes('canonical'));
  if (homeCanon.length !== 1 || homeCanon[0].href !== ORIGIN + '/') {
    err('D5', '/', `dist/index.html canonical must be exactly ${ORIGIN}/`);
  }
  return { errors, pageCount: files.length, switcherCount };
}

// ---------------------------------------------------------------- small helpers

function readdirRootHtml(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => path.join(root, e.name));
}

function anchorHrefsOf(block) { return anchorHrefs(block, block); }

// Header, nav and drawer blocks plus anything with a switcher class or id.
function navBlocks(h) {
  const c = clean(h);
  const out = [];
  for (const name of ['nav', 'header']) {
    for (const m of c.matchAll(new RegExp(`<${name}\\b[\\s\\S]*?</${name}>`, 'gi'))) out.push(m[0]);
  }
  for (const m of c.matchAll(/<(ul|div|li|span|aside)\b[^>]*(?:class|id)\s*=\s*"[^"]*(?:nav__links|docnav__links|navDrawer|switcher|lang-switch)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi)) out.push(m[0]);
  return out;
}

function flattenLd(v, out) {
  if (Array.isArray(v)) { v.forEach((x) => flattenLd(x, out)); return; }
  if (v && typeof v === 'object') {
    out.push(v);
    if (v['@graph']) flattenLd(v['@graph'], out);
  }
}

function llmsSection(text, nameRe) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!h || !nameRe.test(h[2])) continue;
    const level = h[1].length;
    const body = [];
    for (let j = i + 1; j < lines.length; j++) {
      const n = lines[j].match(/^(#{1,6})\s/);
      if (n && n[1].length <= level) break;
      body.push(lines[j]);
    }
    return body.join('\n');
  }
  return null;
}

function wellFormedXml(s) {
  const stack = [];
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([A-Za-z_][\w:.-]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(s))) {
    if (!m[2]) continue;
    if (m[3]) continue;
    if (m[1]) { if (stack.pop() !== m[2]) return false; } else stack.push(m[2]);
  }
  return stack.length === 0 && /<urlset\b/.test(s);
}

function isShallow(root) {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() !== 'false';
  } catch { return true; }
}

function gitDate(root, file) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { return ''; }
}

// ---------------------------------------------------------------- cli

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = { git: !argv.includes('--no-git') };
  const ri = argv.indexOf('--root');
  if (ri >= 0) opt.root = argv[ri + 1];
  const di = argv.indexOf('--dist');
  if (di >= 0) {
    if (argv[di + 1] && !argv[di + 1].startsWith('--')) opt.dist = argv[di + 1];
    const d = lintDist(opt);
    for (const e of d.errors) console.error(`${e.id} ${e.where}: ${e.msg}`);
    if (d.errors.length) {
      console.error(`i18n-lint dist FAILED: ${d.errors.length} error(s)`);
      process.exit(1);
    }
    console.log(`i18n-lint dist ok, ${d.pageCount} pages, ${d.switcherCount} switcher(s)`);
    process.exit(0);
  }
  const ti = argv.indexOf('--today');
  if (ti >= 0) opt.today = argv[ti + 1];
  const { errors, warnings, pageCount } = lint(opt);
  for (const w of warnings) console.warn(`${w.id} ${w.where}: ${w.msg}`);
  for (const e of errors) console.error(`${e.id} ${e.where}: ${e.msg}`);
  if (errors.length) {
    console.error(`i18n-lint FAILED: ${errors.length} error(s)`);
    process.exit(1);
  }
  console.log(`i18n-lint ok, ${pageCount} pages`);
}
