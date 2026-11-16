// Shared by scripts_build_pages.mjs (the English docs generator) and its tests.
// A docs page is five shell segments (head, pre, sidebar, mainopen, tail) around the page body.
// The head and the sidebar are one template each (templates/docs/head.html, sidebar.html): every
// page gets the same tags and the same link list, and only the fields in META_KEYS and OPTIONAL
// differ (og:image:width and og:image:height default to 1200 and 630). The other segments shared
// by two or more pages live in templates/docs/<segment>/<id>.html; a segment used by one page only
// sits in that page's content file under "@@ local <segment>".
import fs from 'node:fs';
import path from 'node:path';

export const SEGMENTS = ['pre', 'mainopen', 'tail'];
// Head fields every page has. Every other head line stays literal in the head template.
export const META_KEYS = [
  'description', 'og:type', 'og:url', 'og:title', 'og:description', 'og:image',
];
// Head fields a page may add. twitter:* falls back to the matching og:* value.
export const OPTIONAL_KEYS = [
  'twitter:title', 'twitter:description', 'twitter:image', 'robots', 'og:image:alt',
  'article:published_time', 'article:modified_time', 'cta_off', 'og:image:width', 'og:image:height',
];
export const CTA_OFF_COMMENT = '<!-- Sitewide signup CTAs off for this page (build.sh opt-out marker: docnav__cta). Single CTA is Book a meeting. -->';
export const HEAD_TPL = 'templates/docs/head.html';
export const SIDEBAR_TPL = 'templates/docs/sidebar.html';
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

const optionalLine = (tag) => (tag ? `\n${tag}` : '');

export function renderHead(meta, sections) {
  const values = { title: meta.title, canonical: meta.canonical };
  for (const k of META_KEYS) {
    if (!(k in meta)) throw new Error(`${meta.canonical}: missing ${k}`);
    values[k] = meta[k];
  }
  for (const k of ['title', 'description', 'image']) values[`twitter:${k}`] = meta[`twitter:${k}`] ?? meta[`og:${k}`];
  values['og:image:width'] = meta['og:image:width'] ?? '1200';
  values['og:image:height'] = meta['og:image:height'] ?? '630';
  values.robots_line = optionalLine(meta.robots && `<meta name="robots" content="${meta.robots}">`);
  values.og_image_alt_line = optionalLine(meta['og:image:alt'] && `<meta property="og:image:alt" content="${meta['og:image:alt']}">`);
  values.article_lines = ['published', 'modified'].map((k) => optionalLine(meta[`article:${k}_time`] && `<meta property="article:${k}_time" content="${meta[`article:${k}_time`]}">`)).join('');
  values.cta_off_comment = meta.cta_off ? `\n\n${CTA_OFF_COMMENT}` : '';
  const ld = Object.keys(sections).filter((k) => k.startsWith('jsonld ')).sort();
  values.jsonld_blocks = ld.map((k) => `<script type="application/ld+json">${sections[k]}</script>\n`).join('');
  values.head_extra = sections['head extra'] !== undefined ? `${sections['head extra']}\n` : '';
  return fill(fs.readFileSync(HEAD_TPL, 'utf8'), values);
}

export function renderPage(content) {
  const { meta, sections } = content;
  const seg = {};
  for (const s of SEGMENTS) {
    seg[s] = sections[`local ${s}`] !== undefined ? sections[`local ${s}`] : loadTemplate(s, meta[`shell.${s}`]);
  }
  const head = renderHead(meta, sections);
  const sidebar = renderSidebar(fs.readFileSync(SIDEBAR_TPL, 'utf8'), meta);
  return head + seg.pre + sidebar + seg.mainopen + sections.body + seg.tail;
}

// Exact comparison on purpose: a whitespace-only difference is still a difference.
export function compare(generated, onDisk) {
  return generated === onDisk ? 'exact' : 'differs';
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
