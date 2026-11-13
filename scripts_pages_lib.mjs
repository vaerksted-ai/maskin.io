// Shared by scripts_build_pages.mjs (generator, kept) and scripts_port_docs.mjs (one-off converter).
// A docs page is five shell segments (head, pre, sidebar, mainopen, tail) around the page body.
// Segments shared by two or more pages live in templates/docs/<segment>/<id>.html; a segment used
// by one page only sits in that page's content file under "@@ local <segment>".
import fs from 'node:fs';
import path from 'node:path';

export const SEGMENTS = ['head', 'pre', 'sidebar', 'mainopen', 'tail'];
// Head fields that differ per page. Every other head line stays literal in the head template.
export const META_KEYS = [
  'description', 'og:type', 'og:url', 'og:title', 'og:description', 'og:image',
  'twitter:title', 'twitter:description', 'twitter:image',
];
export const TPL_DIR = 'templates/docs';
export const CONTENT_DIR = 'content/en/docs';

const tok = (name) => `%%${name}%%`;

export function parseContent(text) {
  const sections = {};
  let cur = null;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = /^@@ (\S+(?: \S+)?)$/.exec(lines[i]);
    if (m && (cur === null || cur !== 'body')) { cur = m[1]; sections[cur] = []; continue; }
    if (cur === null) throw new Error('content before first section marker');
    sections[cur].push(lines[i]);
  }
  const out = {};
  for (const [k, v] of Object.entries(sections)) out[k] = v.join('\n');
  const meta = {};
  for (const l of (out.meta || '').split('\n')) {
    if (!l) continue;
    const i = l.indexOf(': ');
    meta[l.slice(0, i)] = l.slice(i + 2);
  }
  return { meta, sections: out };
}

export function serializeContent({ meta, sections }) {
  const parts = ['@@ meta\n' + Object.entries(meta).map(([k, v]) => `${k}: ${v}`).join('\n')];
  for (const [k, v] of Object.entries(sections)) parts.push(`@@ ${k}\n${v}`);
  // body is last and may end without newline; join with a single newline between sections
  return parts.join('\n');
}

function loadTemplate(seg, id) {
  return fs.readFileSync(path.join(TPL_DIR, seg, `${id}.html`), 'utf8');
}

function fill(skeleton, values) {
  return skeleton.replace(/%%([^%]+)%%/g, (_, name) => {
    if (!(name in values)) throw new Error(`template token ${name} has no value`);
    return values[name];
  });
}

export function renderSidebar(skeleton, meta) {
  if (!meta.active) return skeleton;
  const re = new RegExp(`<a class="([^"]*)" href="${meta.active.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`);
  if (!re.test(skeleton)) throw new Error(`sidebar has no link to ${meta.active}`);
  return skeleton.replace(re, (_, base) => {
    const cls = meta.active_class || (base ? `${base} is-active` : 'is-active');
    return `<a class="${cls}" href="${meta.active}" aria-current="page">`;
  });
}

export function renderPage(content) {
  const { meta, sections } = content;
  const seg = {};
  for (const s of SEGMENTS) {
    seg[s] = sections[`local ${s}`] !== undefined ? sections[`local ${s}`] : loadTemplate(s, meta[`shell.${s}`]);
  }
  const values = { title: meta.title, canonical: meta.canonical };
  for (const k of META_KEYS) if (k in meta) values[k] = meta[k];
  for (const k of Object.keys(sections)) if (k.startsWith('jsonld ')) values[k.replace(' ', '.')] = sections[k];
  const head = fill(seg.head, values);
  const sidebar = seg.sidebar === '' ? '' : renderSidebar(seg.sidebar, meta);
  return head + seg.pre + sidebar + seg.mainopen + sections.body + seg.tail;
}

export function normalise(html) {
  return html.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
}

export function listContent() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) out.push(p);
    }
  })(CONTENT_DIR);
  return out.sort();
}

// content/en/docs/<slug>.html  ->  docs/<slug>/index.html
export function sourcePathFor(contentPath) {
  const rel = path.relative(CONTENT_DIR, contentPath).replace(/\.html$/, '');
  return path.join('docs', rel, 'index.html');
}
export { tok };
