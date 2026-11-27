#!/usr/bin/env node
// Marketplace hub generator: marketplace/flows.json -> the card grid, the group pills and the
// JSON-LD list inside marketplace/index.html.
//   node scripts_build_marketplace_hub.mjs --write    regenerate the marked regions of marketplace/index.html
//   node scripts_build_marketplace_hub.mjs --check    fail if the committed page differs from the generated one
// Regions in index.html are fenced by <!-- hub:NAME:start --> and <!-- hub:NAME:end -->. Production
// serves the committed page, so --write output is committed with the change.
import fs from 'node:fs';

export const PAGE = 'marketplace/index.html';
export const DATA = 'marketplace/flows.json';
const SITE = 'https://maskin.io';

const ICONS = {
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  release: '<path d="M12 17V4"/><path d="M6 10l6-6 6 6"/><path d="M5 21h14"/>',
  bars: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2.5.7 4 2.5 4 5.5"/>',
  book: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  funnel: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  branch: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v3a4 4 0 0 0 4 4h5.5"/>',
  signal: '<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/>',
  receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  deck: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v5M8 21h8"/>',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icon = (name) => {
  if (!ICONS[name]) throw new Error(`unknown icon ${name}`);
  return `<svg class="hub-ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
};
export const groupHref = (g) => `/marketplace/?group=${encodeURIComponent(g)}`;

export function loadData() {
  const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const ids = new Set();
  for (const f of d.flows) {
    if (ids.has(f.id)) throw new Error(`duplicate flow id ${f.id}`);
    ids.add(f.id);
    if (!['ready', 'soon'].includes(f.status)) throw new Error(`${f.id}: status must be ready or soon`);
    if (f.status === 'ready' && !f.install) throw new Error(`${f.id}: a ready flow needs install`);
    if (f.kind !== undefined && f.kind !== 'Agent') throw new Error(`${f.id}: kind must be Agent when set`);
    if (!d.groups.includes(f.group)) throw new Error(`${f.id}: unknown group ${f.group}`);
    for (const t of f.teams) if (!d.teams.includes(t)) throw new Error(`${f.id}: unknown team ${t}`);
    for (const j of f.jobs) if (!d.jobs.some((x) => x.id === j)) throw new Error(`${f.id}: unknown job ${j}`);
    icon(f.icon);
  }
  const ranks = d.flows.map((f) => f.rank);
  if (new Set(ranks).size !== ranks.length) throw new Error('ranks must be unique');
  const icons = d.flows.map((f) => f.icon);
  if (new Set(icons).size !== icons.length) throw new Error('every flow needs its own icon');
  return d;
}

export function sorted(d) {
  const by = (a, b) => a.rank - b.rank;
  return [...d.flows.filter((f) => f.status === 'ready').sort(by), ...d.flows.filter((f) => f.status === 'soon').sort(by)];
}

function card(f) {
  const ready = f.status === 'ready';
  const attrs = `data-flow="${esc(f.id)}" data-status="${f.status}" data-group="${esc(f.group)}" data-jobs="${f.jobs.join(' ')}" data-teams="${esc(f.teams.join('|'))}" data-kind="${f.kind ? 'agent' : 'flow'}" data-rank="${f.rank}"`;
  const action = ready
    ? `<div class="loop-install" data-loop-install="${esc(f.install.slug)}" data-install-position="index"><a class="hub-btn" href="${esc(f.install.href)}" data-install-link data-install-slug="${esc(f.install.slug)}" aria-label="Install ${esc(f.title)}">Install</a></div>`
    : `<a class="hub-btn hub-btn--ghost" href="https://meshfirm.com/bookmagnus" target="_blank" rel="noopener">Book a walkthrough</a>`;
  const status = `<span class="hub-label ${ready ? 'hub-label--on' : 'hub-label--soon'}">${ready ? 'Available' : 'Coming soon'}</span>`;
  const labels = f.kind
    ? `<span class="hub-card__labels"><span class="hub-label hub-label--agent">${esc(f.kind)}</span>${status}</span>`
    : status;
  return `      <article class="hub-card${ready ? '' : ' hub-card--soon'}" ${attrs}>
        <div class="hub-card__top"><span class="hub-ico">${icon(f.icon)}</span>${labels}</div>
        <h3 class="hub-card__title"><a class="hub-card__link" href="${esc(f.url)}">${esc(f.title)}</a></h3>
        <p class="hub-card__desc">${esc(f.desc)}</p>
        <div class="hub-card__foot"><a class="hub-card__group" href="${groupHref(f.group)}">${esc(f.group)}</a>${action}</div>
      </article>`;
}

export function renderGrid(d) {
  const list = sorted(d);
  const ready = list.filter((f) => f.status === 'ready');
  const soon = list.filter((f) => f.status === 'soon');
  return [
    ...ready.map(card),
    `      <div class="hub-div" id="hub-div"><h2>Coming soon <span id="hub-div-n">${soon.length}</span></h2><p>Not installable yet. Book a walkthrough to see how each one would run for your team.</p></div>`,
    ...soon.map(card),
  ].join('\n');
}

export function renderGroups(d) {
  return d.groups
    .map((g) => `<a class="hub-pill" href="${groupHref(g)}" data-group-link="${esc(g)}">${esc(g)} <span class="hub-pill__n">${d.flows.filter((f) => f.group === g).length}</span></a>`)
    .join('\n      ');
}

export function renderLd(d) {
  const items = sorted(d).map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${f.url}`, name: f.title }));
  return `<script type="application/ld+json" id="hub-ld">
${JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'Maskin Marketplace',
          headline: '__HEADLINE__',
          description: '__DESCRIPTION__',
          url: `${SITE}/marketplace/`,
          inLanguage: 'en',
          isPartOf: { '@type': 'WebSite', name: 'Maskin', url: `${SITE}/` },
          publisher: { '@type': 'Organization', name: 'Maskin', url: `${SITE}/` },
          mainEntity: { '@type': 'ItemList', itemListElement: items },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Marketplace', item: `${SITE}/marketplace/` },
          ],
        },
      ],
    },
    null,
    2,
  )}
</script>`;
}

const region = (name) => new RegExp(`(<!-- hub:${name}:start -->)[\\s\\S]*?(<!-- hub:${name}:end -->)`);

export function render(html, d) {
  const swap = (h, name, body) => {
    if (!region(name).test(h)) throw new Error(`marketplace/index.html has no hub:${name} region`);
    return h.replace(region(name), (_, a, b) => `${a}\n${body}\n${b}`);
  };
  // The JSON-LD headline and description follow the page's own title and meta description.
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title || !desc) throw new Error('page has no title or meta description');
  const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const ld = renderLd(d).replace('__HEADLINE__', unesc(title)).replace('__DESCRIPTION__', unesc(desc));
  let out = swap(html, 'grid', renderGrid(d));
  out = swap(out, 'groups', '      ' + renderGroups(d));
  out = swap(out, 'ld', ld);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  const d = loadData();
  const html = fs.readFileSync(PAGE, 'utf8');
  const out = render(html, d);
  if (mode === '--write') {
    fs.writeFileSync(PAGE, out);
    console.log(`marketplace hub: wrote ${d.flows.length} cards to ${PAGE}`);
  } else if (mode === '--check') {
    if (out !== html) {
      console.error(`${PAGE} differs from ${DATA}. Run: node scripts_build_marketplace_hub.mjs --write`);
      process.exit(1);
    }
    console.log('marketplace hub: page matches flows.json');
  } else {
    console.error('usage: node scripts_build_marketplace_hub.mjs --write | --check');
    process.exit(2);
  }
}
