#!/usr/bin/env node
// English docs generator (templates + content -> HTML).
//   node scripts_build_pages.mjs --write        regenerate docs/**/index.html from templates/ and content/
//   node scripts_build_pages.mjs --check        fail if any docs/**/index.html differs from the generated page
//   node scripts_build_pages.mjs --out <dir>    write generated pages under <dir>/docs/**/index.html
// Production serves the committed docs/**/index.html, so --write output is committed with the change.
// --check is exact: a whitespace-only difference fails it.
import fs from 'node:fs';
import path from 'node:path';
import { listContent, parseContent, renderPage, compare, sourcePathFor } from './scripts_pages_lib.mjs';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? args[outIdx + 1] : null;
const check = args.includes('--check');
const write = args.includes('--write');
if (!check && !write && !outDir) { console.error('usage: --write | --check | --out <dir>'); process.exit(2); }

let exact = 0;
const bad = [];
for (const cp of listContent()) {
  const html = renderPage(parseContent(fs.readFileSync(cp, 'utf8')));
  const src = sourcePathFor(cp);
  if (outDir || write) {
    const dst = write ? src : path.join(outDir, src);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, html);
  }
  if (check) {
    if (compare(html, fs.readFileSync(src, 'utf8')) === 'exact') exact++;
    else bad.push(src);
  }
}
if (check) {
  console.log(`docs pages: ${exact} identical to the generated page, ${bad.length} differ`);
  for (const b of bad) console.log(`  DIFF ${b}`);
  process.exit(bad.length ? 1 : 0);
}
