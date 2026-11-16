// Public marketing pages must stay readable for people who are signed in to the app.
// Run with: node --test scripts_public_pages.test.mjs
//
// Only the home page (in every language, and its template) may send a signed-in visitor on to /workspaces. Every other page
// (deck, terms, privacy, support, docs, ...) once copied that script and bounced signed-in
// visitors away from the page they opened.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const SKIP = new Set(['.git', 'node_modules', 'dist', 'scripts_lint_i18n_fixtures', 'scripts_lint_i18n_dist_fixtures']);

function htmlFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// The homepage of each language is generated from templates/home/index.html (content/<lang>/home.json names the output).
const homePages = new Set(['templates/home/index.html']);
for (const e of fs.readdirSync(path.join(root, 'content'), { withFileTypes: true })) {
  const f = path.join(root, 'content', e.name, 'home.json');
  if (e.isDirectory() && fs.existsSync(f)) homePages.add(JSON.parse(fs.readFileSync(f, 'utf8')).fields.out);
}

test('only the home page redirects signed-in visitors to the app', () => {
  const offenders = htmlFiles(root)
    .map((f) => path.relative(root, f))
    .filter((f) => f !== 'index.html' && !homePages.has(f))
    .filter((f) => /maskin-api-key/.test(fs.readFileSync(path.join(root, f), 'utf8')));
  assert.deepEqual(offenders, []);
});
