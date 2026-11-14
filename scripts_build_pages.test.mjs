// The English docs generator and the committed docs pages must agree, and the shared head and
// sidebar must not drift. Run with: node --test scripts_build_pages.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare, listContent, parseContent, sourcePathFor, SIDEBAR_TPL } from './scripts_pages_lib.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);

test('docs/**/index.html is exactly what the generator writes', () => {
  const r = spawnSync('node', ['scripts_build_pages.mjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr + '\nRun: node scripts_build_pages.mjs --write');
  assert.match(r.stdout, / 0 differ$/m);
});

test('the comparison fails on a whitespace-only difference', () => {
  assert.equal(compare('<p>a</p>\n', '<p>a</p>\n'), 'exact');
  assert.equal(compare('<p>a</p>\n', '<p>a</p>'), 'differs');
  assert.equal(compare('<p>a</p>', '<p> a</p>'), 'differs');
  assert.equal(compare('<p>a</p>\n<p>b</p>', '<p>a</p>\n\n<p>b</p>'), 'differs');
});

test('the shared sidebar lists the same links as the NAV array in docs/docs.js (Dansk group aside)', () => {
  const js = fs.readFileSync('docs/docs.js', 'utf8');
  const NAV = new Function(`return ${/var NAV = (\[[\s\S]*?\n  \]);/.exec(js)[1].replace(/;$/, '')}`)();
  const want = NAV.filter((g) => g.title !== 'Dansk').flatMap((g) => g.items.map((i) => i.href));
  const have = [...fs.readFileSync(SIDEBAR_TPL, 'utf8').matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(have, want);
});

test('no page in sitemap.xml is hidden with a robots tag', () => {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>https:\/\/maskin\.io([^<]+)<\/loc>/g)].map((m) => m[1]));
  const clash = listContent()
    .map((cp) => ({ meta: parseContent(fs.readFileSync(cp, 'utf8')).meta, cp }))
    .filter(({ meta }) => /noindex/.test(meta.robots || '') && listed.has(new URL(meta.canonical).pathname))
    .map(({ cp }) => sourcePathFor(cp));
  assert.deepEqual(clash, []);
});
