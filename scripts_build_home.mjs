#!/usr/bin/env node
// Homepage generator (template + one strings file per language -> HTML).
//   node scripts_build_home.mjs --write        regenerate the homepage of every language from templates/home/ and content/<lang>/home.json
//   node scripts_build_home.mjs --check        fail if any homepage on disk differs from the generated page
//   node scripts_build_home.mjs --out <dir>    write the generated pages under <dir>
// content/<lang>/home.json has "fields" (out path, lang, og_locale, canonical, home_href) and "strings".
// Strings whose key starts with "ld." sit inside JSON-LD and are JSON-escaped on the way in.
// Production serves the committed pages, so --write output is committed with the change.
import fs from 'node:fs';
import path from 'node:path';

export const TEMPLATE = 'templates/home/index.html';
export const CONTENT = 'content';
const FIELDS = ['out', 'lang', 'og_locale', 'canonical', 'home_href'];

export function listHomes() {
  return fs.readdirSync(CONTENT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(CONTENT, e.name, 'home.json')))
    .map((e) => path.join(CONTENT, e.name, 'home.json'))
    .sort();
}

export function renderHome(doc, template = fs.readFileSync(TEMPLATE, 'utf8')) {
  for (const f of FIELDS) if (typeof doc.fields?.[f] !== 'string') throw new Error(`fields.${f} is missing`);
  const values = { ...doc.fields };
  for (const [k, v] of Object.entries(doc.strings)) values[k] = k.startsWith('ld.') ? JSON.stringify(v).slice(1, -1) : v;
  const used = new Set();
  const html = template.replace(/%%([^%]+)%%/g, (_, name) => {
    if (!(name in values)) throw new Error(`template token ${name} has no value`);
    used.add(name);
    return values[name];
  });
  const unused = Object.keys(values).filter((k) => !used.has(k) && k !== 'out');
  if (unused.length) throw new Error(`strings not used by the template: ${unused.join(', ')}`);
  return html;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outDir = outIdx >= 0 ? args[outIdx + 1] : null;
  const check = args.includes('--check');
  const write = args.includes('--write');
  if (!check && !write && !outDir) { console.error('usage: --write | --check | --out <dir>'); process.exit(2); }
  let exact = 0;
  const bad = [];
  for (const file of listHomes()) {
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    const html = renderHome(doc);
    const dst = doc.fields.out;
    if (write || outDir) {
      const target = write ? dst : path.join(outDir, dst);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
    }
    if (check) {
      if (fs.existsSync(dst) && fs.readFileSync(dst, 'utf8') === html) exact++;
      else bad.push(dst);
    }
  }
  if (check) {
    console.log(`homepages: ${exact} identical to the generated page, ${bad.length} differ`);
    for (const b of bad) console.log(`  DIFF ${b}`);
    process.exit(bad.length ? 1 : 0);
  }
}
