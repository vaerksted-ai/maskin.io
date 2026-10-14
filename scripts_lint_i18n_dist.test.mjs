// Tests for the --dist mode of scripts_lint_i18n.mjs (checks D1 to D5).
// Run with: node --test scripts_lint_i18n_dist.test.mjs
//
// scripts_lint_i18n_dist_fixtures/pass is a complete passing site: an i18n.json plus a rendered
// dist/ folder. Each folder under fail/ is an overlay copied over a fresh copy of pass. The
// folder name is the check id (a "-suffix" names an extra variant) and the dist lint must
// report exactly that id, nothing else.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lintDist } from './scripts_lint_i18n.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, 'scripts_lint_i18n.mjs');
const fixtures = path.join(here, 'scripts_lint_i18n_dist_fixtures');

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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-dist-lint-'));
  copyDir(path.join(fixtures, 'pass'), dir);
  if (failName) copyDir(path.join(fixtures, 'fail', failName), dir);
  return dir;
}

const ids = (result) => [...new Set(result.errors.map((e) => e.id))];

test('passing fixture dist has no errors and counts its four switchers', () => {
  const dir = materialize();
  try {
    const result = lintDist({ root: dir });
    assert.deepEqual(result.errors, []);
    assert.equal(result.switcherCount, 4); // home bar, home drawer, hub, docs page
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

const failNames = fs.readdirSync(path.join(fixtures, 'fail'));

test('every check D1 to D5 has a failing fixture', () => {
  const covered = new Set(failNames.map((n) => n.split('-')[0]));
  for (let i = 1; i <= 5; i++) assert.ok(covered.has(`D${i}`), `no failing fixture for D${i}`);
});

for (const name of failNames) {
  const expected = name.split('-')[0];
  test(`fixture ${name} fails with exactly ${expected}`, () => {
    const dir = materialize(name);
    try {
      assert.deepEqual(ids(lintDist({ root: dir })), [expected]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

test('a missing dist folder fails D5', () => {
  const dir = materialize();
  fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true });
  try {
    assert.deepEqual(ids(lintDist({ root: dir })), ['D5']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('cli: --dist exits 0 with one quiet line on the passing site', () => {
  const dir = materialize();
  try {
    const r = spawnSync('node', [script, '--dist', '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), 'i18n-lint dist ok, 3 pages, 4 switcher(s)');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('cli: --dist exits 1 and prints the error id on a failing site', () => {
  const dir = materialize('D1');
  try {
    const r = spawnSync('node', [script, '--dist', '--root', dir], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /^D1 /m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
