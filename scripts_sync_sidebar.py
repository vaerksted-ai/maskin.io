#!/usr/bin/env python3
"""Insert one page into the baked-in docs sidebar of every docs page, right after an
existing entry. The sidebar is static markup (see README), so a new page has to be added to
each docs/**/index.html as well as the NAV array in docs/docs.js.
Usage:  python3 scripts_sync_sidebar.py NEW_SLUG "Label" AFTER_SLUG
Idempotent: pages whose sidebar already links NEW_SLUG are left alone."""
import re, sys, glob, html

new, label, after = sys.argv[1:4]
href = "/docs/%s/" % new
item = '<li><a class="is-nested" href="%s">%s</a></li>' % (href, html.escape(label, quote=False))
anchor = re.compile(r'<li><a class="[^"]*" href="/docs/%s/"[^>]*>[^<]*</a></li>' % re.escape(after))

changed = skipped = 0
for path in sorted(glob.glob("docs/**/index.html", recursive=True)):
    s = open(path, encoding="utf-8").read()
    head, sep, tail = s.partition("</aside>")
    if "doc-sidebar__list" not in head:
        continue
    if 'href="%s"' % href in head:
        continue
    m = anchor.search(head)
    if not m:
        print("no anchor, skipped:", path); skipped += 1; continue
    open(path, "w", encoding="utf-8").write(s[:m.end()] + item + s[m.end():])
    changed += 1
print("sidebar updated on %d pages, %d skipped" % (changed, skipped))
