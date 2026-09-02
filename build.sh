#!/bin/bash
set -e

if [ -z "$POSTHOG_PROJECT_KEY" ]; then
  echo "Error: POSTHOG_PROJECT_KEY environment variable is not set" >&2
  exit 1
fi

rm -rf dist
mkdir -p dist

# Loose top-level files
cp index.html 404.html robots.txt sitemap.xml site.webmanifest _redirects dist/
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

echo "Build complete. PostHog snippet + key injected."
