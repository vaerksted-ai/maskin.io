#!/usr/bin/env node
// English docs generator (templates + content -> HTML).
//   node scripts_build_pages.mjs --check        compare output with the hand-written docs/**/index.html
//   node scripts_build_pages.mjs --out <dir>    write generated pages under <dir>/docs/**/index.html
// Not wired into build.sh yet: production still serves the hand-written files until the port is proven.
import fs from 'node:fs';
import path from 'node:path';
import { listContent, parseContent, renderPage, normalise, sourcePathFor } from './scripts_pages_lib.mjs';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? args[outIdx + 1] : null;
const check = args.includes('--check');
if (!check && !outDir) { console.error('usage: --check | --out <dir>'); process.exit(2); }

let exact = 0, whitespaceOnly = 0;
const bad = [];
for (const cp of listContent()) {
  const html = renderPage(parseContent(fs.readFileSync(cp, 'utf8')));
  const src = sourcePathFor(cp);
  if (outDir) {
    const dst = path.join(outDir, src);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, html);
  }
  if (check) {
    const today = fs.readFileSync(src, 'utf8');
    if (html === today) exact++;
    else if (normalise(html) === normalise(today)) whitespaceOnly++;
    else bad.push(src);
  }
}
if (check) {
  console.log(`docs pages: ${exact} byte-identical, ${whitespaceOnly} differ in whitespace only, ${bad.length} differ`);
  for (const b of bad) console.log(`  DIFF ${b}`);
  process.exit(bad.length ? 1 : 0);
}
