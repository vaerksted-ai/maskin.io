#!/bin/bash
set -e

# Site-side PostHog write key for the workspace's canonical Maskin Project (id 191282).
# Public, browser-visible, write-only — safe to inline. Previously read from
# $POSTHOG_PROJECT_KEY, but that Cloudflare env var pointed at a different project and
# silently mis-routed on-site telemetry away from the workspace MCP.
POSTHOG_PROJECT_KEY="phc_tfrEvZMAfNvPzmof6dHMndPEDuLe4wNdPDBTUJA66Zww"

rm -rf dist
mkdir -p dist

# Loose top-level files
cp index.html 404.html robots.txt sitemap.xml site.webmanifest _redirects _headers dist/
cp apple-touch-icon.png favicon.ico favicon.svg icon-192.png icon-512.png og-image.png og-image.svg dist/
# Per-page OG images: any og-image-<slug>.svg / .png at root ships automatically.
# Nullglob so we don't crash if a category is momentarily empty.
shopt -s nullglob
for f in og-image-*.svg og-image-*.png; do
  cp "$f" dist/
done
shopt -u nullglob
cp llms.txt llms-full.txt dist/
cp maskin-launch.mp4 dist/

# Top-level content subtrees. Add a new SEO cluster hub here (one line) and every
# page under it ships automatically — no other build.sh edits required.
CONTENT_DIRS=(docs changelog privacy alternatives)
for dir in "${CONTENT_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    cp -r "$dir" "dist/$dir"
  else
    echo "Warning: content dir '$dir' listed in CONTENT_DIRS but not found on disk" >&2
  fi
done

# Auto-inject the PostHog snippet into any HTML in dist/ that doesn't already
# ship it, so new pages under any CONTENT_DIR fire pageviews without a per-page
# edit. Injection is placed just before </head>; pages that hand-roll a custom
# snippet keep theirs and are skipped.
if [ ! -f partials/posthog.html ]; then
  echo "Error: partials/posthog.html missing — cannot inject PostHog snippet" >&2
  exit 1
fi
find dist -type f -name '*.html' | while IFS= read -r html; do
  if grep -q "POSTHOG_PROJECT_KEY" "$html"; then
    continue
  fi
  if ! grep -q "</head>" "$html"; then
    echo "Warning: no </head> in $html — skipping PostHog injection" >&2
    continue
  fi
  awk -v snippet_file=partials/posthog.html '
    BEGIN {
      while ((getline line < snippet_file) > 0) {
        snippet = (snippet == "" ? line : snippet ORS line)
      }
      close(snippet_file)
    }
    /<\/head>/ && !injected {
      print snippet
      injected = 1
    }
    { print }
  ' "$html" > "$html.tmp" && mv "$html.tmp" "$html"
done

# Inject PostHog key into every HTML in dist/. Any page that carries the
# POSTHOG_PROJECT_KEY placeholder (hand-rolled or auto-injected above) is
# picked up automatically.
find dist -type f -name '*.html' -print0 | xargs -0 sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g"

# Auto-inject docs-shell signup CTAs into every HTML under dist/docs/ that
# doesn't already ship them. Three insertions per page: a "Sign up" <li> in the
# top nav (right before the theme toggle), and an end-of-article "Try Maskin"
# card + "Try Maskin free" strip immediately before the related-articles nav
# (fallback: before .doc-pagenav, then </main>). Idempotent — hand-rolled pages
# carrying the .docnav__cta or .docs-cta__primary class opt out and are skipped.
if [ ! -f partials/docs-cta.html ]; then
  echo "Error: partials/docs-cta.html missing — cannot inject docs-shell CTAs" >&2
  exit 1
fi

extract_docs_cta_section() {
  awk -v start="$1" -v end="$2" '
    $0 ~ start { capture=1; next }
    $0 ~ end   { capture=0 }
    capture    { print }
  ' partials/docs-cta.html
}
DOCS_CTA_HEADER=$(extract_docs_cta_section 'DOCS_CTA_HEADER_START' 'DOCS_CTA_HEADER_END')
DOCS_CTA_CARD=$(extract_docs_cta_section 'DOCS_CTA_CARD_START' 'DOCS_CTA_CARD_END')
DOCS_CTA_STRIP=$(extract_docs_cta_section 'DOCS_CTA_STRIP_START' 'DOCS_CTA_STRIP_END')

if [ -z "$DOCS_CTA_HEADER" ] || [ -z "$DOCS_CTA_CARD" ] || [ -z "$DOCS_CTA_STRIP" ]; then
  echo "Error: could not extract all three CTA sections from partials/docs-cta.html" >&2
  exit 1
fi

find dist/docs -type f -name '*.html' | while IFS= read -r html; do
  if grep -q 'docnav__cta\|docs-cta__primary' "$html"; then
    continue
  fi
  awk -v cta_header="$DOCS_CTA_HEADER" -v cta_card="$DOCS_CTA_CARD" -v cta_strip="$DOCS_CTA_STRIP" '
    {
      if (!header_done) {
        idx = index($0, "<li><button class=\"theme-toggle\"")
        if (idx > 0) {
          $0 = substr($0, 1, idx-1) cta_header substr($0, idx)
          header_done = 1
        }
      }
      if (!body_done && ($0 ~ /<div class="related">/ || $0 ~ /<nav class="doc-pagenav"/ || $0 ~ /<\/main>/)) {
        print cta_card
        print cta_strip
        body_done = 1
      }
      print
    }
  ' "$html" > "$html.tmp" && mv "$html.tmp" "$html"
done

echo "Build complete. PostHog snippet + key + docs-shell CTAs injected."
