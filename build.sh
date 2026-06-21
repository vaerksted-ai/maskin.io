#!/bin/bash
set -e

if [ -z "$POSTHOG_PROJECT_KEY" ]; then
  echo "Error: POSTHOG_PROJECT_KEY environment variable is not set" >&2
  exit 1
fi

rm -rf dist
mkdir -p dist

# Copy static files
cp index.html 404.html robots.txt sitemap.xml site.webmanifest dist/
cp apple-touch-icon.png favicon.ico favicon.svg icon-192.png icon-512.png og-image.png og-image.svg dist/
cp llms.txt llms-full.txt dist/
cp maskin-launch.mp4 dist/
cp -r docs dist/docs

# Inject PostHog key
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/index.html

echo "Build complete. PostHog key injected."
