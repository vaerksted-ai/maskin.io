// Tests for scripts_inject_switcher.mjs. Run with: node --test scripts_inject_switcher.test.mjs
// Fixtures are small inline pages that carry the same anchors as the real ones: the docs shell
// (docnav bar with a GitHub li and the theme-toggle li), the homepage (ul.nav__links with the
// nav__login li, plus the bare ul inside nav#navDrawer) and a skip-list page with no nav.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { injectPage, injectDist, switcherItems } from './scripts_inject_switcher.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'scripts_inject_switcher.mjs');

const GITHUB = '<li><a href="https://github.com/sindre-ai/maskin" target="_blank" rel="noopener">GitHub</a></li>';
const TOGGLE = '<li><button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode"></button></li>';

const manifest = ({ da = false, sv = false } = {}) => ({
  languages: {
    da: { locale: 'da_DK', hub: '/da/', enabled: true, nav: da },
    sv: { locale: 'sv_SE', hub: '/sv/', enabled: false, nav: sv },
  },
  groups: { home: { en: '/', da: '/da/' } },
  pages: [],
  switcher_skip: ['changelog', '404.html'],
});

function docsPage({ lang = 'en', head = '', toggle = true } = {}) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><title>T</title>${head}</head>
<body>
<nav class="docnav" id="docnav"><div class="wrap docnav__inner"><a class="docnav__logo" href="/">Maskin</a><span class="docnav__tag">Docs</span><ul class="docnav__links"><li><a href="/docs/">Docs</a></li>${GITHUB}<li class="docnav__cta-wrap"><a class="docnav__cta" href="/signup">Sign up</a></li>${toggle ? TOGGLE : ''}</ul></div></nav>
<main><h1>T</h1></main>
</body>
</html>
`;
}

function homePage({ login = true, drawer = true } = {}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><title>Home</title><link rel="canonical" href="https://maskin.io/"><link rel="alternate" hreflang="da" href="https://maskin.io/da/"></head>
<body>
<nav class="nav" id="nav"><div class="nav__inner"><ul class="nav__links"><li><a href="/marketplace/">Marketplace</a></li>${GITHUB}${login ? '<li><a class="nav__login" href="/login">Log in</a></li>' : ''}<li><a class="nav__signup" href="/signup">Sign up</a></li></ul></div></nav>
${drawer ? '<nav class="nav__drawer" id="navDrawer" aria-label="Mobile navigation">\n  <ul>\n    <li><a href="/marketplace/">Marketplace</a></li>\n    <li><a href="/login">Log in</a></li>\n  </ul>\n  <a class="nav__drawer-cta" href="/signup">Sign up free</a>\n</nav>' : ''}
</body>
</html>
`;
}

const count = (s, needle) => s.split(needle).length - 1;
const groupOf = (html) => html.match(/<div\b[^>]*data-lang-switcher[^>]*>[\s\S]*?<\/div>/)[0];

function tmpDist(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'inject-switcher-'));
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), content);
  }
  return dir;
}

test('docs-shell page, da on: two items, inserted right before the theme-toggle li', () => {
  const { html, changed } = injectPage(docsPage(), 'docs', manifest({ da: true }));
  assert.equal(changed, true);
  const g = groupOf(html);
  assert.equal(count(g, 'class="lang__item"'), 2);
  assert.match(g, /aria-label="Language"/);
  assert.match(g, /<a class="lang__item" lang="da" hreflang="da" href="\/da\/" aria-label="Dansk">/);
  assert.ok(html.includes(`</div></li>${TOGGLE}`), 'group sits immediately before the toggle li');
  assert.ok(html.indexOf('docnav__cta') < html.indexOf('data-lang-switcher'), 'after the Sign up li');
  assert.ok(!html.includes('rel="alternate"'), 'the injector never emits a rel=alternate link tag');
});

test('current item is a span with aria-current true, other items are links without it', () => {
  const { html } = injectPage(docsPage(), 'docs', manifest({ da: true }));
  const g = groupOf(html);
  assert.match(g, /<span class="lang__item" lang="en" aria-current="true">/);
  assert.equal(count(g, 'aria-current'), 1);
  assert.doesNotMatch(g, /<a[^>]*aria-current/);
});

test('flag gating: da off gives no switcher on an English page, page is returned untouched', () => {
  const page = docsPage();
  const r = injectPage(page, 'docs', manifest({ da: false }));
  assert.equal(r.changed, false);
  assert.equal(r.html, page);
  assert.equal(count(r.html, 'docnav__hide-sm'), 0);
});

test('flag gating: sv off hides Svenska everywhere, sv on adds it as the third item', () => {
  const off = injectPage(docsPage(), 'docs', manifest({ da: true, sv: false })).html;
  assert.doesNotMatch(off, /Svenska|\/sv\//);
  const home = injectPage(homePage(), 'home', manifest({ da: true, sv: false })).html;
  assert.doesNotMatch(home, /Svenska|\/sv\//);
  const on = injectPage(docsPage(), 'docs', manifest({ da: true, sv: true })).html;
  const g = groupOf(on);
  assert.equal(count(g, 'class="lang__item"'), 3);
  assert.match(g, /href="\/sv\/"/);
  assert.ok(g.indexOf('English') < g.indexOf('Dansk') && g.indexOf('Dansk') < g.indexOf('Svenska'), 'order is English, Dansk, Svenska');
});

test('hide when fewer than 2 items: sv alone does not count on a da-less English page, nothing renders', () => {
  assert.deepEqual(switcherItems(docsPage(), manifest({ da: false, sv: false })).items, []);
  assert.equal(switcherItems(docsPage(), manifest({ da: false, sv: true })).items.length, 2);
});

test('a Danish page with da.nav false still shows English plus its own current Dansk, in Danish', () => {
  const page = docsPage({ lang: 'da' });
  const { html } = injectPage(page, 'docs', manifest({ da: false }));
  const g = groupOf(html);
  assert.match(g, /aria-label="Sprog"/);
  assert.match(g, /<a class="lang__item" lang="en" hreflang="en" href="\/" aria-label="English">/);
  assert.match(g, /<span class="lang__item" lang="da" aria-current="true">/);
});

test('twin href comes from the head alternates, otherwise the hub, and / for English', () => {
  const home = switcherItems(homePage(), manifest({ da: true })).items;
  assert.equal(home.find((i) => i.lang === 'da').href, '/da/');
  const twin = docsPage({ head: '<link rel="alternate" hreflang="da" href="https://maskin.io/da/mit-twin/">' });
  assert.equal(switcherItems(twin, manifest({ da: true })).items.find((i) => i.lang === 'da').href, '/da/mit-twin/');
  const noTwin = docsPage();
  assert.equal(switcherItems(noTwin, manifest({ da: true })).items.find((i) => i.lang === 'da').href, '/da/');
  const dk = docsPage({ lang: 'da' });
  assert.equal(switcherItems(dk, manifest({ da: true })).items.find((i) => i.lang === 'en').href, '/');
});

test('the GitHub li gets docnav__hide-sm only on pages where the switcher renders', () => {
  const on = injectPage(docsPage(), 'docs', manifest({ da: true })).html;
  assert.ok(on.includes(`<li class="docnav__hide-sm"><a href="https://github.com/sindre-ai/maskin"`));
  const off = injectPage(docsPage(), 'docs', manifest({ da: false })).html;
  assert.ok(off.includes(GITHUB));
  assert.equal(count(off, 'docnav__hide-sm'), 0);
});

test('the link list gets the tighter-gap modifier only on pages where the switcher renders', () => {
  const on = injectPage(docsPage(), 'docs', manifest({ da: true })).html;
  assert.ok(on.includes('<ul class="docnav__links docnav__links--lang">'));
  const off = injectPage(docsPage(), 'docs', manifest({ da: false })).html;
  assert.ok(off.includes('<ul class="docnav__links">'));
});

test('the section tag next to the logo gets docnav__hide-sm only on pages where the switcher renders', () => {
  const on = injectPage(docsPage(), 'docs', manifest({ da: true })).html;
  assert.ok(on.includes('<span class="docnav__tag docnav__hide-sm">Docs</span>'));
  const off = injectPage(docsPage(), 'docs', manifest({ da: false })).html;
  assert.ok(off.includes('<span class="docnav__tag">Docs</span>'));
});

test('homepage, da on: desktop group sits between GitHub and Log in, drawer row is last in the drawer ul, CSS added once', () => {
  const { html } = injectPage(homePage(), 'home', manifest({ da: true }));
  assert.equal(count(html, 'data-lang-switcher'), 2);
  const bar = html.indexOf('class="lang"');
  assert.ok(html.indexOf('>GitHub</a>') < bar && bar < html.indexOf('class="nav__login"'), 'between GitHub and Log in');
  assert.match(html, /<a href="\/login">Log in<\/a><\/li>\s*<li class="lang-drawer">[\s\S]*?<\/li>\s*<\/ul>/);
  assert.equal(count(html, 'id="lang-switcher-css"'), 1);
  assert.match(html, /@media\(max-width:960px\)\{\.nav__links\{display:none\}/, 'drawer takes over below 960px when the switcher renders');
  assert.ok(html.indexOf('lang-switcher-css') < html.indexOf('</head>'));
  assert.equal(count(html, 'class="nav__signup"'), 1, 'the rest of the nav is untouched');
});

test('homepage, da off: no switcher, no CSS, page untouched', () => {
  const page = homePage();
  const r = injectPage(page, 'home', manifest({ da: false }));
  assert.equal(r.changed, false);
  assert.equal(r.html, page);
});

test('missing anchors fail: toggle li, nav__login li, drawer ul', () => {
  const m = manifest({ da: true });
  assert.throws(() => injectPage(docsPage({ toggle: false }), 'docs', m), /theme-toggle/);
  assert.throws(() => injectPage(homePage({ login: false }), 'home', m), /nav__login/);
  assert.throws(() => injectPage(homePage({ drawer: false }), 'home', m), /navDrawer/);
});

test('injectDist: docs page and homepage get a switcher, skip-list pages are left alone', () => {
  const dist = tmpDist({
    'index.html': homePage(),
    'docs/a/index.html': docsPage(),
    'changelog/index.html': '<html><body>no nav at all</body></html>',
    '404.html': '<html><body>404</body></html>',
  });
  try {
    const r = injectDist(dist, manifest({ da: true }));
    assert.deepEqual(r.errors, []);
    assert.equal(r.injected, 2);
    assert.equal(r.skipped, 2);
    assert.equal(fs.readFileSync(path.join(dist, 'changelog/index.html'), 'utf8'), '<html><body>no nav at all</body></html>');
    assert.equal(fs.readFileSync(path.join(dist, '404.html'), 'utf8'), '<html><body>404</body></html>');
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('injectDist: a docs page without the toggle li and a page with no nav outside the skip list both fail', () => {
  const dist = tmpDist({
    'docs/a/index.html': docsPage({ toggle: false }),
    'docs/orphan/index.html': '<html><body>no nav, not in switcher_skip</body></html>',
  });
  try {
    const r = injectDist(dist, manifest({ da: true }));
    assert.equal(r.errors.length, 2);
    assert.match(r.errors.join('\n'), /docs\/a\/index\.html: .*theme-toggle/);
    assert.match(r.errors.join('\n'), /docs\/orphan\/index\.html: no docnav and not in switcher_skip/);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('a second run is a no-op', () => {
  const dist = tmpDist({ 'index.html': homePage(), 'docs/a/index.html': docsPage() });
  try {
    const first = injectDist(dist, manifest({ da: true }));
    assert.equal(first.injected, 2);
    const snapshot = Object.fromEntries(['index.html', 'docs/a/index.html'].map((f) => [f, fs.readFileSync(path.join(dist, f), 'utf8')]));
    const second = injectDist(dist, manifest({ da: true }));
    assert.equal(second.injected, 0);
    assert.equal(second.unchanged, 2);
    for (const [f, before] of Object.entries(snapshot)) assert.equal(fs.readFileSync(path.join(dist, f), 'utf8'), before);
    assert.equal(count(snapshot['docs/a/index.html'], 'data-lang-switcher'), 1);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
  }
});

test('cli: prints one ok line, and exits 1 naming the page when an anchor is missing', () => {
  const dist = tmpDist({ 'docs/a/index.html': docsPage() });
  const manifestFile = path.join(dist, '..', `manifest-${path.basename(dist)}.json`);
  fs.writeFileSync(manifestFile, JSON.stringify(manifest({ da: true })));
  try {
    const ok = spawnSync('node', [script, dist, '--manifest', manifestFile], { encoding: 'utf8' });
    assert.equal(ok.status, 0);
    assert.match(ok.stdout, /^inject-switcher ok, 1 page\(s\) with a switcher, 0 without, 0 skipped/);
    fs.writeFileSync(path.join(dist, 'docs/b.html'), '<html><body>no nav</body></html>');
    const bad = spawnSync('node', [script, dist, '--manifest', manifestFile], { encoding: 'utf8' });
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /docs\/b\.html/);
  } finally {
    fs.rmSync(dist, { recursive: true, force: true });
    fs.rmSync(manifestFile, { force: true });
  }
});
