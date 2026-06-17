# maskin.io

Static landing page and docs for [Maskin](https://maskin.io) — the open-source, MCP-native agentic workspace where humans and AI agents work together.

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
  `FAQPage`; each docs page has `TechArticle` + `BreadcrumbList`. Keep JSON-LD values
  in sync with the visible meta tags and content.
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

Pure static HTML/CSS/JS. No build step to serve. No runtime dependencies.
`scripts_gen_md.py` (Python 3, stdlib only) regenerates the Markdown mirrors offline.
Fonts loaded from Google Fonts CDN.
