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
cp -r bet-based-product-planning dist/bet-based-product-planning
cp -r ai-product-management-tool dist/ai-product-management-tool
cp -r what-is-an-agentic-workspace dist/what-is-an-agentic-workspace
cp -r self-hosted-ai-workspace dist/self-hosted-ai-workspace

# Inject PostHog key into every generated HTML file that references the placeholder.
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/changelog/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/privacy/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/what-is-mcp-native/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/bet-based-product-planning/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/what-is-an-agentic-workspace/index.html
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/self-hosted-ai-workspace/index.html

echo "Build complete. PostHog key injected."