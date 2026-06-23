# maskin.io

Static landing page and docs for [Maskin](https://maskin.io) — the open-source,
MCP-native system where humans and AI agents close the loop together, from customer
signal to shipped bet to measured outcome.

## Deploy

Served via **Cloudflare Pages**. Push to `main` and Cloudflare builds and deploys to
maskin.io; every pull request gets its own preview deployment automatically. There's
no build step — Cloudflare serves the static files as-is.

The custom domain (`maskin.io`) is configured in the Cloudflare Pages dashboard, not
in the repo.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — single self-contained file (styles + scripts inline) |
| `404.html` | Not-found page — redirects to `/` |
| `maskin-launch.mp4` | Launch/demo video embedded on the landing page |
| `og-image.svg` / `og-image.png` | Social share card (1200×630); the SVG is the source, the PNG is what pages reference |
| `favicon.ico` / `favicon.svg` / `icon-192.png` / `icon-512.png` / `apple-touch-icon.png` | Favicons and PWA icons |
| `site.webmanifest` | Web app manifest |
| `robots.txt` | Crawl rules — allows search and AI/LLM crawlers; points to `llms.txt` |
| `sitemap.xml` | Sitemap (docs pages + `llms.txt` / `llms-full.txt`) |
| `llms.txt` | Curated, LLM-readable map of the site ([llmstxt.org](https://llmstxt.org) format) |
| `llms-full.txt` | All docs concatenated into one file for full-context LLM ingestion |
| `docs/` | Documentation (hand-written HTML; shared `docs.css` / `docs.js`) |
| `docs/**/*.md` | Markdown mirror of each docs page (generated — see below) |
| `scripts_gen_md.py` | Regenerates the `.md` mirrors and `llms-full.txt` from the docs HTML |

## Docs & AI discoverability

The site is built to be understood by LLMs and agents, not just search engines:

- **Static nav** — the docs top bar and sidebar are rendered into the HTML of every
  page (not injected by JS), so crawlers and no-JS clients see the full nav graph.
  `docs.js` only enhances: theme toggle, scroll state, and a JS fallback if a page's
  nav container is empty. The nav model lives in both the static markup and the `NAV`
  array in `docs.js` — keep them in sync when adding pages.
- **Structured data (JSON-LD)** — every page carries schema.org metadata: the home
  page has `Organization` + `WebSite` + `SoftwareApplication` (with `offers`) +
  `VideoObject` (the demo) + `FAQPage`; each docs page has `TechArticle` (with
  `datePublished` / `dateModified`) + `BreadcrumbList`. Keep JSON-LD values in sync
  with the visible meta tags and content.
- **`llms.txt` / `llms-full.txt`** — `llms.txt` is curated by hand; `llms-full.txt`
  and the per-page `.md` mirrors are generated. After editing docs HTML, run:

  ```
  python3 scripts_gen_md.py
  ```

- **Markdown mirrors** — each docs page at `/docs/<path>/` has a clean-URL Markdown
  twin at `/docs/<path>.md` (e.g. `/docs/concepts/` ↔ `/docs/concepts.md`), produced
  by `scripts_gen_md.py`. Don't hand-edit them — edit the HTML and regenerate.
- **OpenAPI** — the live API spec is served from each Maskin instance at
  `/openapi.json` and linked from `llms.txt` and `/docs/api/`.

## Stack

Pure static HTML/CSS/JS. No build step — Cloudflare Pages serves the files as-is. No
runtime dependencies. `scripts_gen_md.py` (Python 3, stdlib only) regenerates the
Markdown mirrors offline. Fonts are loaded from the Google Fonts CDN.
