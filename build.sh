#!/bin/bash
set -e

if [ -z "$POSTHOG_PROJECT_KEY" ]; then
  echo "Error: POSTHOG_PROJECT_KEY environment variable is not set" >&2
  exit 1
fi

rm -rf dist
mkdir -p dist

# Copy all static assets
rsync -av --exclude=dist --exclude=.git --exclude=.claude --exclude=.playwright-mcp --exclude=node_modules . dist/

# Inject PostHog key
sed -i "s/POSTHOG_PROJECT_KEY/$POSTHOG_PROJECT_KEY/g" dist/index.html

echo "Build complete. PostHog key injected."
