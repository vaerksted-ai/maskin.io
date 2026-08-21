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
cp -r changelog dist/changelog
cp -r privacy dist/privacy
cp -r what-is-mcp-native dist/what-is-mcp-native

# Inject PostHog key into every generated HTML file that references the placeholder.
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/changelog/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/privacy/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/what-is-mcp-native/index.html

echo "Build complete. PostHog key injected."
