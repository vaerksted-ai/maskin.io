#!/usr/bin/env python3
"""Add one page to the docs sidebar, right after an existing entry.
The sidebar is one template (templates/docs/sidebar.html) and the NAV array in docs/docs.js
must list the same links, so this edits both. Then regenerate the pages:
  node scripts_build_pages.mjs --write
Usage:  python3 scripts_sync_sidebar.py NEW_SLUG "Label" AFTER_SLUG
Idempotent: nothing changes if the sidebar already links NEW_SLUG."""
import re, sys, html, json

new, label, after = sys.argv[1:4]
href = "/docs/%s/" % new
after_href = "/docs/%s/" % after

TPL = "templates/docs/sidebar.html"
JS = "docs/docs.js"

tpl = open(TPL, encoding="utf-8").read()
if 'href="%s"' % href in tpl:
    print("sidebar already links %s, nothing to do" % href)
    sys.exit(0)

anchor = re.compile(r'<li><a class="[^"]*" href="%s"[^>]*>[^<]*</a></li>' % re.escape(after_href))
m = anchor.search(tpl)
if not m:
    sys.exit("no sidebar entry for %s in %s" % (after_href, TPL))
item = '<li><a class="is-nested" href="%s">%s</a></li>' % (href, html.escape(label, quote=False))
open(TPL, "w", encoding="utf-8").write(tpl[:m.end()] + item + tpl[m.end():])

js = open(JS, encoding="utf-8").read()
lines = js.split("\n")
idx = next((i for i, l in enumerate(lines) if 'href: "%s"' % after_href in l), None)
if idx is None:
    sys.exit("no NAV entry for %s in %s" % (after_href, JS))
indent = re.match(r"\s*", lines[idx]).group(0)
entry = '%s{ label: %s, href: "%s", nested: true }' % (indent, json.dumps(label, ensure_ascii=False), href)
if lines[idx].rstrip().endswith(","):
    lines.insert(idx + 1, entry + ",")
else:
    lines[idx] = lines[idx].rstrip() + ","
    lines.insert(idx + 1, entry)
open(JS, "w", encoding="utf-8").write("\n".join(lines))
print("sidebar template and NAV updated; now run: node scripts_build_pages.mjs --write")
