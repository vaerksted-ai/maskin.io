# maskin.io

Static landing page for [Maskin](https://maskin.io) — the workspace where humans and AI agents work together.

## Deploy

Served via GitHub Pages. Push to `main` → live at maskin.io.

### Custom domain

The `CNAME` file points to `maskin.io`. In your DNS provider, add:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  vaerksted-ai.github.io.
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — single self-contained file |
| `404.html` | Redirect to `/` |
| `CNAME` | Custom domain config for GitHub Pages |
| `.nojekyll` | Skips Jekyll processing |
| `robots.txt` | Search engine crawl rules |
| `sitemap.xml` | SEO sitemap |

## Stack

Pure static HTML/CSS/JS. No build step. No dependencies.
Fonts loaded from Google Fonts CDN.
