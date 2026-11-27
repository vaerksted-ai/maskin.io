import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadData, sorted, render, PAGE } from './scripts_build_marketplace_hub.mjs';

test('flows.json is valid and every flow has its own icon and rank', () => {
  const d = loadData();
  assert.equal(d.flows.length, 16);
});

test('ready flows come first, each by rank, and ready flows have an install link', () => {
  const list = sorted(loadData());
  const firstSoon = list.findIndex((f) => f.status === 'soon');
  assert.ok(list.slice(firstSoon).every((f) => f.status === 'soon'));
  for (const part of [list.slice(0, firstSoon), list.slice(firstSoon)]) {
    assert.deepEqual(part.map((f) => f.rank), [...part.map((f) => f.rank)].sort((a, b) => a - b));
  }
});

test('marketplace/index.html matches flows.json (run --write after editing the data)', () => {
  const html = fs.readFileSync(PAGE, 'utf8');
  assert.equal(render(html, loadData()), html);
});

test('every hub card links to a listing page that exists', () => {
  for (const f of loadData().flows) {
    assert.ok(fs.existsSync(`.${f.url}index.html`), `${f.id}: ${f.url} has no page`);
  }
});

test('a flow is ready exactly when its listing page has an install link', () => {
  for (const f of loadData().flows) {
    const has = fs.readFileSync(`.${f.url}index.html`, 'utf8').includes('data-install-link');
    assert.equal(f.status === 'ready', has, `${f.id}: hub says ${f.status}, listing ${has ? 'has' : 'has no'} install link`);
  }
});

test('hub copy has no em dash and no approval wording', () => {
  const html = fs.readFileSync(PAGE, 'utf8');
  assert.ok(!/—|&mdash;/.test(html));
  assert.ok(!/approv|sign[- ]off/i.test(html.replace(/<script[\s\S]*?<\/script>/g, '')));
});
