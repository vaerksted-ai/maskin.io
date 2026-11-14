// The English docs generator must reproduce today's hand-written docs pages.
// Run with: node --test scripts_build_pages.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

test('generated English docs pages match docs/**/index.html (whitespace aside)', () => {
  const r = spawnSync('node', ['scripts_build_pages.mjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, / 0 differ$/m);
});
