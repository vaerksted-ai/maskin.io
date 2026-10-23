// Tests for scripts_lint_i18n.mjs. Run with: node --test scripts_lint_i18n.test.mjs
//
// scripts_lint_i18n_fixtures/pass is a complete passing site. Each folder under
// scripts_lint_i18n_fixtures/fail/ is an overlay: its files are copied over a fresh copy of
// pass, and paths listed in its optional _delete.txt are removed. The folder name is the
// check id (a "-suffix" names an extra variant of the same check) and the lint must report
// exactly that id, nothing else.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lint } from './scripts_lint_i18n.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, 'scripts_lint_i18n.mjs');
const fixtures = path.join(here, 'scripts_lint_i18n_fixtures');
const TODAY = '2026-10-13';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function materialize(failName) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-lint-'));
  copyDir(path.join(fixtures, 'pass'), dir);
  const overlay = path.join(fixtures, 'fail', failName);
  for (const line of (fs.existsSync(path.join(overlay, '_delete.txt')) ? fs.readFileSync(path.join(overlay, '_delete.txt'), 'utf8') : '').split('\n')) {
    if (line.trim()) fs.rmSync(path.join(dir, line.trim()), { force: true });
  }
  const walk = (d, rel = '') => {
    for (const e of fs.readdirSync(path.join(d, rel), { withFileTypes: true })) {
      const r = path.join(rel, e.name);
      if (e.isDirectory()) walk(d, r);
      else if (e.name !== '_delete.txt') {
        fs.mkdirSync(path.dirname(path.join(dir, r)), { recursive: true });
        fs.copyFileSync(path.join(d, r), path.join(dir, r));
      }
    }
  };
  walk(overlay);
  return dir;
}

const run = (root) => lint({ root, today: TODAY, git: false });
const ids = (result) => [...new Set(result.errors.map((e) => e.id))];

test('passing fixture site has no errors', () => {
  const result = run(path.join(fixtures, 'pass'));
  assert.deepEqual(result.errors, []);
  assert.equal(result.pageCount, 3);
});

const failNames = fs.readdirSync(path.join(fixtures, 'fail'));

test('every check L1 to L18 has a failing fixture', () => {
  const covered = new Set(failNames.map((n) => n.split('-')[0]));
  // L14 (native review gate) was removed 2026-10-23; the id stays retired so the others keep their numbers.
  for (let i = 1; i <= 18; i++) if (i !== 14) assert.ok(covered.has(`L${i}`), `no failing fixture for L${i}`);
});

for (const name of failNames) {
  const expected = name.split('-')[0];
  test(`fixture ${name} fails with exactly ${expected}`, () => {
    const dir = materialize(name);
    try {
      assert.deepEqual(ids(run(dir)), [expected]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

test('cli: exit 0 and one quiet line on the passing site', () => {
  const out = execFileSync('node', [script, '--root', path.join(fixtures, 'pass'), '--today', TODAY, '--no-git']).toString();
  assert.equal(out.trim(), 'i18n-lint ok, 3 pages');
});

test('cli: exit 1 and the error id on a failing site', () => {
  const dir = materialize('L12');
  try {
    const r = spawnSync('node', [script, '--root', dir, '--today', TODAY, '--no-git'], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /^L12 /m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('self-check: the real repo passes the source lint', () => {
  const result = lint({ root: here, git: false });
  assert.deepEqual(result.errors, []);
});

test('L8: a link to an external_paths entry resolves, the same link without the entry fails L8 only', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-lint-'));
  copyDir(path.join(fixtures, 'pass'), dir);
  try {
    const hubFile = path.join(dir, 'da', 'index.html');
    fs.writeFileSync(hubFile, fs.readFileSync(hubFile, 'utf8').replace('</ul>', '<li><a href="/bookseb">/bookseb</a></li>\n</ul>'));
    assert.deepEqual(ids(run(dir)), ['L8']);
    const manifestFile = path.join(dir, 'i18n.json');
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    manifest.external_paths = ['/bookseb'];
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
    assert.deepEqual(run(dir).errors, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
