// The homepage generator and the committed homepages must agree. Run with: node --test scripts_build_home.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome, listHomes } from './scripts_build_home.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);

test('every homepage on disk is exactly what the generator writes', () => {
  const r = spawnSync('node', ['scripts_build_home.mjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr + '\nRun: node scripts_build_home.mjs --write');
  assert.match(r.stdout, / 0 differ$/m);
});

test('changing one string changes the generated page', () => {
  const doc = JSON.parse(fs.readFileSync('content/en/home.json', 'utf8'));
  const before = renderHome(doc);
  doc.strings['hero.sub1'] += ' ';
  assert.notEqual(renderHome(doc), before);
});

test('a string the template does not use is an error', () => {
  const doc = JSON.parse(fs.readFileSync('content/en/home.json', 'utf8'));
  doc.strings['stray.key'] = 'x';
  assert.throws(() => renderHome(doc), /not used by the template/);
});

test('a template token with no string is an error', () => {
  const doc = JSON.parse(fs.readFileSync('content/en/home.json', 'utf8'));
  delete doc.strings['hero.sub1'];
  assert.throws(() => renderHome(doc), /hero\.sub1 has no value|token hero\.sub1/);
});

test('JSON-LD strings are escaped, so a quote cannot break the structured data', () => {
  const doc = JSON.parse(fs.readFileSync('content/en/home.json', 'utf8'));
  doc.strings['ld.faq1.a'] = 'He said "hi"';
  const html = renderHome(doc);
  const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1];
  assert.doesNotThrow(() => JSON.parse(ld));
});

test('every homepage keeps a canonical link that matches its fields', () => {
  for (const f of listHomes()) {
    const doc = JSON.parse(fs.readFileSync(f, 'utf8'));
    assert.match(renderHome(doc), new RegExp(`<link rel="canonical" href="${doc.fields.canonical}">`));
  }
});
