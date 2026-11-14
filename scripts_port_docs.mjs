#!/usr/bin/env node
// One-off: split every hand-written docs/**/index.html into shell templates and a per-page
// content file (templates/docs/, content/en/docs/). Read-only on docs/. Re-runnable: it wipes and
// rewrites templates/docs and content/en/docs. The proof that nothing changed is
// `node scripts_build_pages.mjs --check`, not this script.
import fs from 'node:fs';
import path from 'node:path';
import { SEGMENTS, META_KEYS, TPL_DIR, CONTENT_DIR, serializeContent } from './scripts_pages_lib.mjs';

const SKIP = new Set(['docs/open-source-jira-alternative/index.html']); // redirect stub, not a docs page

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name === 'index.html') files.push(p);
  }
})('docs');
files.sort();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pages = [];
for (const f of files) {
  if (SKIP.has(f)) continue;
  const s = fs.readFileSync(f, 'utf8');
  const meta = {};
  const sections = {};
  const iHeadEnd = s.indexOf('</head>') + '</head>'.length;
  let head = s.slice(0, iHeadEnd);
  const iAside = s.indexOf('<aside class="doc-sidebar"');
  const iAsideEnd = s.indexOf('</aside>') + '</aside>'.length;
  const mMain = /<main[^>]*>/.exec(s);
  const iMainEnd = s.lastIndexOf('</main>');
  if (iAside < 0 || !mMain || iMainEnd < 0) throw new Error(`${f}: unexpected shell`);
  const pre = s.slice(iHeadEnd, iAside);
  let sidebar = s.slice(iAside, iAsideEnd);
  const mainopen = s.slice(iAsideEnd, mMain.index + mMain[0].length);
  const body = s.slice(mMain.index + mMain[0].length, iMainEnd);
  const tail = s.slice(iMainEnd);
  if (/^@@ /m.test(body)) throw new Error(`${f}: body has a line starting with "@@ "`);
  if (/%%/.test(head + sidebar + pre + mainopen + tail)) throw new Error(`${f}: shell contains %%`);

  // head -> skeleton + fields
  head = head.replace(/<title>(.*)<\/title>/, (_, t) => { meta.title = t; return '<title>%%title%%</title>'; });
  head = head.replace(/<link rel="canonical" href="([^"]*)">/, (_, c) => { meta.canonical = c; return '<link rel="canonical" href="%%canonical%%">'; });
  for (const k of META_KEYS) {
    const attr = k.startsWith('og:') ? 'property' : 'name';
    const re = new RegExp(`<meta ${attr}="${esc(k)}" content="([^"]*)">`);
    head = head.replace(re, (_, v) => { meta[k] = v; return `<meta ${attr}="${k}" content="%%${k}%%">`; });
  }
  let n = 0;
  head = head.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (_, a, j, b) => {
    sections[`jsonld ${n}`] = j; return `${a}%%jsonld.${n++}%%${b}`;
  });
  for (const v of Object.values(meta)) if (v.includes('\n')) throw new Error(`${f}: multi-line meta`);

  // sidebar -> skeleton (active link neutralised) + active href
  sidebar = sidebar.replace(/<a class="([^"]*)" href="([^"]+)" aria-current="page">/, (_, c, h) => {
    meta.active = h;
    const base = c.split(/\s+/).filter((x) => x !== 'is-active').join(' ');
    const derived = base ? `${base} is-active` : 'is-active';
    if (derived !== c) meta.active_class = c;
    return `<a class="${base}" href="${h}">`;
  });

  pages.push({ f, meta, sections: { ...sections, body }, seg: { head, pre, sidebar, mainopen, tail } });
}

// cluster identical segments; used by >= 2 pages -> shared template, else local to the page
fs.rmSync(TPL_DIR, { recursive: true, force: true });
fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
const stats = {};
for (const seg of SEGMENTS) {
  const groups = new Map();
  for (const p of pages) {
    const k = p.seg[seg];
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  let i = 0, shared = 0, local = 0;
  for (const [text, ps] of ordered) {
    if (ps.length >= 2) {
      const id = `${seg[0]}${++i}`;
      fs.mkdirSync(path.join(TPL_DIR, seg), { recursive: true });
      fs.writeFileSync(path.join(TPL_DIR, seg, `${id}.html`), text);
      for (const p of ps) p.meta[`shell.${seg}`] = id;
      shared++;
    } else {
      ps[0].sections[`local ${seg}`] = text;
      local++;
    }
  }
  stats[seg] = { shared_templates: shared, page_local: local };
}

for (const p of pages) {
  const rel = path.relative('docs', path.dirname(p.f));
  const out = path.join(CONTENT_DIR, `${rel}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // order: meta, jsonld, locals, body (body last)
  const { body, ...rest } = p.sections;
  fs.writeFileSync(out, serializeContent({ meta: p.meta, sections: { ...rest, body } }));
}
console.log(`ported ${pages.length} docs pages`);
console.table(stats);
