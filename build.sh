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

# Inject PostHog key into every HTML in dist/. Any new page that carries the
# POSTHOG_PROJECT_KEY placeholder is picked up automatically.
find dist -type f -name '*.html' -print0 | xargs -0 sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g"

echo "Build complete. PostHog key injected."
