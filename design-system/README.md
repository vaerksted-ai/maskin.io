# Maskin design system — v1 inventory

**Status:** rough v1. Catalogue only — no redesigns, no new tokens, no new components. Flag drift, don't fix it.
**Scope:** what's *rendered* by Maskin surfaces today (2026-08-25). Cross-referenced against declared source where visible.
**Author:** Product Designer. **Reviewers:** Sebk, Chief of Staff.

---

## TL;DR — the shape of the system today

Maskin ships **two parallel design systems** on the same domain, under one brand:

| System | Where | Source | Token style | Font |
|---|---|---|---|---|
| **Brand** | marketing (`/`), docs (`/docs/*`), 404, login redirects | `vaerksted-ai/maskin.io` repo — inline `<style>` in `index.html` + `docs/docs.css` | Custom CSS vars: `--ink`, `--surface`, `--linen`, `--accent`, `--rule`, `--step-0..4` | Schibsted Grotesk / Newsreader / JetBrains Mono |
| **App** | workspace UI (`/login`, `/signup`, `/<workspace-id>/*`) | **not in `vaerksted-ai/*` public/visible repos** — SPA served from `maskin.io/assets/index-*.js` + `index-*.css` | shadcn/ui defaults (Tailwind + Radix): `--background`, `--foreground`, `--primary`, `--muted`, `--ring`, `--border`, `--radius` | Schibsted Grotesk (only shared token) |

**The two systems only share the display font.** Colors, spacing scale, radii, component vocabulary, and interaction primitives diverge. This is v1's most important finding and the highest-value thing to consolidate — see **Known drift #1** below.

**Access constraint:** the app source repo isn't visible from this account. App inventory below is reverse-engineered from the compiled CSS and the rendered DOM on `/login` (the only unauthenticated app surface). Authenticated surfaces (Bets, Objects, Agents, For You feed) are on the roadmap for v2 once we get a login.

---

## Brand system (marketing + docs)

Source of truth: [`docs/docs.css`](https://github.com/vaerksted-ai/maskin.io/blob/main/docs/docs.css) (header comment says tokens are "copied from index.html so docs match brand" — treat `index.html`'s `:root` block as canonical).

### Tokens — colour (light)
| Var | Hex | Role |
|---|---|---|
| `--ink` | `#111110` | primary text, ink-button bg |
| `--ink-2` | `#5A5751` | body text, secondary text |
| `--ink-3` | `#9B958F` | muted / meta / eyebrow |
| `--surface` | `#FAFAF8` | page background (warm off-white) |
| `--linen` | `#F0EDE7` | subtle surface (code blocks, sections, cards) |
| `--rule` | `#E2DDD7` | borders, hairlines |
| `--accent` | `#2563EB` | links, primary accent (blue) |
| `--accent-dim` | `rgba(37,99,235,0.12)` | accent fills (callouts, active nav) |

### Tokens — colour (dark, via `prefers-color-scheme` OR `[data-theme="dark"]`)
| Var | Hex |
|---|---|
| `--ink` | `#ECEAE4` |
| `--ink-2` | `#A09A93` |
| `--ink-3` | `#6B6560` |
| `--surface` | `#141412` |
| `--linen` | `#1C1B18` |
| `--rule` | `#2A2925` |
| `--accent` | `#3B74F2` |
| `--accent-dim` | `rgba(59,116,242,0.15)` |

`[data-theme="light"]` and `[data-theme="dark"]` overrides both exist — the theme toggle is a real, first-class control (see `.theme-toggle` in `docs.css`).

### Tokens — typography
| Var | Value |
|---|---|
| `--ff-display` | `'Schibsted Grotesk', sans-serif` (body + UI default) |
| `--ff-serif` | `'Newsreader', Georgia, serif` (defined but rarely used — check drift) |
| `--ff-mono` | `'JetBrains Mono', monospace` (eyebrow, code, tags, breadcrumb) |

Type scale (fluid, `clamp()`-driven):
| Step | Range | Used for |
|---|---|---|
| `--step-0` | `13 → 15px` | small meta, table body |
| `--step-1` | `15 → 18px` | body copy |
| `--step-2` | `18 → 24px` | lead paragraph, h3 |
| `--step-3` | `24 → 40px` | h2, section titles |
| `--step-4` | `32 → 60px` | hero / h1 |

### Tokens — layout / spacing
| Var | Value |
|---|---|
| `--max-w` | `1280px` |
| `--gap` | `clamp(1rem, 3vw, 2.5rem)` (page gutter) |
| `--section-py` | `clamp(4rem, 9vw, 8rem)` (landing sections) |
| `--nav-bg-scrolled` | `rgba(250,250,248,.92)` light / `rgba(20,20,18,.92)` dark |

No formal spacing scale — spacing is ad-hoc in rem/px. **Drift candidate.**

### Tokens — radii, shadows, motion
- **Radii:** ad-hoc, no vars. Observed values: `5px` (inline code), `6px` (nav CTA, mono tag), `7px` (sidebar links), `8px` (theme toggle, buttons), `12px` (callout, code block), `14px` (card), `16px` (post-CTA panel).
- **Shadows:** only one, on primary-button hover: `0 4px 16px rgba(17,17,16,.18)`.
- **Motion:** transitions are ad-hoc — `.15s` colour, `.2s` background, `.25s` nav. No easing named. Global `@media (prefers-reduced-motion: reduce)` disables everything.

### Layout primitives
- `.wrap` — max-width container: `max-width: var(--max-w); margin-inline:auto; padding-inline: var(--gap)`.
- `.section` — vertical rhythm block: `padding-block: var(--section-py)`. Variants: `.section--linen`, `.section--ink` (inverted).
- `.doc-layout` — docs two-pane: `grid-template-columns: 240px minmax(0,1fr)` above 860px, single column below.
- `.doc-sidebar` — sticky at `top:84px`, collapses to static above the content below 860px.
- `.doc-content` — `max-width: 46rem` reading measure.

### Breakpoints
| px | Trigger | Change |
|---|---|---|
| ≤560 | small mobile | nav links compress, post-CTA actions stack |
| ≤640 | mobile (hero-specific) | h1/hero-visual reflow (marketing only) |
| ≤860 | tablet | docs sidebar collapses to horizontal above content; mobile nav drawer appears (marketing has its own hamburger drawer) |

**Only three breakpoints in code.** No `1024px` or `1280px` split. The `CLAUDE.md` design brief calls for mobile 640 / tablet 1024 / desktop — treat 860 as the current de-facto tablet cutoff and align prototypes to the code rather than the brief (or file a note to reconcile).

### Components (brand)
- **Nav bar** (`.nav`) — fixed top, transparent → blurs on scroll (`.scrolled`). Logo left, links + login + signup CTA right. Mobile: hamburger (`.nav__hamburger`) + full-screen drawer (`.nav__drawer`).
- **Docs nav** (`.docnav`) — sticky variant of the above, no signup CTA, includes theme toggle.
- **Logo mark** — inline SVG, 28×28, rounded-14 dark square with white "M" stroke. Colours: `#111110` bg / `#FAFAF8` stroke (light theme).
- **Primary button** (`.btn-primary`) — ink background, surface text, `border-radius:8px`, hover: lift + shadow. Used on marketing CTAs and post-CTA blocks in docs.
- **Secondary button** (`.btn-secondary`) — transparent bg, ink text, rule border, hover: linen bg.
- **Signup CTA** (`.nav__signup`) — accent-blue bg, white text, `border-radius:6px`. **Slightly different visual language than `.btn-primary`** — see drift #3.
- **Mono tag** (`.docnav__tag`, `.doc-card__tag`) — mono font, `.7rem`, uppercase, `border-radius:6px`, rule border. Consistent across surfaces.
- **Eyebrow** (`.eyebrow`) — mono font, `.7rem`, uppercase, accent colour, no border.
- **Callout** (`.callout`) — accent-dim bg, accent border, `border-radius:12px`. Variant: `.callout--muted` (linen bg, rule border).
- **Card** (`.doc-card`) — surface bg, rule border, `border-radius:14px`, hover: darker border + `translateY(-2px)`.
- **Doc table** (`.doc-table`) — no borders except bottom hairlines on rows. `th` uppercase mono-ish (font-size .78rem, letter-spaced).
- **Code inline** — linen bg, rule border, `border-radius:5px`. **Different radius from every other primitive** — see drift #2.
- **Code block** (`pre`) — linen bg, rule border, `border-radius:12px`.
- **Sidebar link** (`.doc-sidebar__list a`) — rounded-7, ink-2 text; active state = accent text, accent-dim bg, accent 2px left border.
- **Theme toggle** (`.theme-toggle`) — 32×32 square button, sun/moon icon swap keyed off `[data-theme]`.

### Interaction patterns (brand)
- **Focus rings:** none defined. Browser defaults only. **Accessibility gap — flag for consolidation.**
- **Hover:** underline on links (`a:hover`), colour-shift on nav/sidebar, `translateY(-1px|-2px)` lift on buttons/cards.
- **Reduced motion:** globally handled (`* { transition: none !important }`).
- **Keyboard:** no defined patterns beyond browser defaults. No skip-link.
- **Empty / loading / error states:** none defined at the brand-CSS level (marketing/docs are static — states not required).

---

## App system (workspace UI)

Source of truth: **not visible in the `vaerksted-ai` GitHub org.** The app SPA is built and served from `https://maskin.io/assets/` (React + shadcn/ui + Radix by DOM inspection). Reverse-engineered from the `/login` page.

### Tokens — colour (light, from computed `:root`)
| Var | Hex |
|---|---|
| `--background` | `#ffffff` (pure white — **not `--surface: #FAFAF8`**) |
| `--foreground` | `#18181b` (zinc-950 — **not `--ink: #111110`**) |
| `--muted` | `#f4f4f5` (zinc-100) |
| `--muted-foreground` | `#71717a` (zinc-500) |
| `--primary` | `#18181b` (same as foreground) |
| `--primary-foreground` | `#ffffff` |
| `--secondary` | `#f6f6f7` |
| `--secondary-foreground` | `#18181b` |
| `--destructive` | `#dc2626` |
| `--destructive-foreground` | `#ffffff` |
| `--border` | `#e4e4e7` (zinc-200 — **not `--rule: #E2DDD7`**) |
| `--input` | `#e4e4e7` |
| `--ring` | `#a1a1aa` (zinc-400) |
| `--card` / `--popover` | `#ffffff` |
| `--accent` | `#f6f6f7` (**collides semantically with brand `--accent: #2563EB` — same var name, opposite role**) |
| `--radius` | `0.625rem` (10px, declared) — but rendered buttons/inputs use `border-radius: 8px` |

Dark mode: exists (shadcn/ui defaults) but not audited in v1.

### Tokens — typography (app)
- **Body font:** `"Schibsted Grotesk", "Schibsted Grotesk Fallback", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` — shares only the display face with brand.
- **Size scale:** Tailwind defaults (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`…). No fluid `clamp()`.
- **No serif or mono declared at root.** Mono presumably per-component.

### Layout / spacing (app)
- Tailwind's 4px-based spacing scale (`p-1`, `p-2`, `p-4`, `space-y-4`, `space-y-6`, `max-w-sm`, `min-h-screen`).
- **No shared `--max-w` or `--gap`.**
- Breakpoints: Tailwind defaults (`sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`). **Different set than brand's 560/640/860.**

### Components (app — only login surface visible)
- **Input** (`<input class="flex h-10 w-full rounded-md border border-input …">`) — h-40, rounded-8, border via `--input`, focus: `ring-2 ring-ring ring-offset-2`.
- **Button primary** (`<button class="… bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">`) — h-40, rounded-8 (`rounded-md`), 500 weight, hover: 90% opacity.
- **Label** (`<label class="text-sm font-medium leading-none … text-muted-foreground">`) — 14px, medium, muted colour.
- **Form spacing** — `space-y-4` between fields, `space-y-6` between form sections.
- **Toast** — Sonner (`data-sonner-toaster`), full inline CSS from library. Uses its own gray1–12 palette (**doesn't reference brand or app tokens** — drift).

**Everything else** (Bets, Tasks, For You feed, Objects, comment threads, sidebar shell, command bar, keyboard shortcuts) — not inventoried in v1. Needs an authenticated login.

### Interaction patterns (app — from login)
- **Focus ring:** `ring-2 ring-ring ring-offset-2` on inputs and buttons. **Real focus rings — better than brand.**
- **Hover:** opacity fade on primary button (`hover:bg-primary/90`). No lift.
- **Disabled state:** `disabled:opacity-50`, `disabled:cursor-not-allowed`.
- **Keyboard / a11y:** ARIA present (`aria-label`, `aria-live`, `aria-relevant`, `aria-atomic`) on the toast region.
- **Loading / error / empty states:** not observed on login.

---

## Known drift — candidates for consolidation (v2 material, DO NOT fix in v1)

1. **Brand vs app token systems are entirely separate.**
   - Brand uses `--ink #111110`; app uses `--foreground #18181b`. Both mean "primary text" but resolve to different colours.
   - Brand `--surface #FAFAF8` (warm off-white) vs app `--background #ffffff` (pure white) — the app is visibly *colder* than the marketing site.
   - Brand `--accent #2563EB` (blue link colour) vs app `--accent #f6f6f7` (light grey surface). **Same var name, opposite semantic role** — will bite anyone trying to unify.
   - Impact: the app doesn't feel like the marketing/docs. A user landing after signup lands in a different brand.

2. **Radius vocabulary is inconsistent** even *within* the brand system: `5px` (inline code), `6px` (nav CTA, mono tag), `7px` (sidebar link), `8px` (theme toggle, button), `10px` (declared `--radius` in app), `12px` (callout, code block), `14px` (card), `16px` (post-CTA). No scale, no reasoning documented. App uses one radius (`rounded-md` = 8px).

3. **Primary CTA has two forms in the brand system**: `.btn-primary` (ink bg, 8px radius) on marketing hero + docs post-CTA; `.nav__signup` (accent-blue bg, 6px radius) in the nav. Two "primary" buttons doing similar jobs with different visuals — pick one.

4. **No spacing scale.** Both systems inherit their spacing from elsewhere (brand: ad-hoc rem/px; app: Tailwind's 4px scale). No shared 4/8/12/16/24/32/48/64 tokens named at the brand level.

5. **Focus states are absent in the brand system** — accessibility gap. App has them via shadcn defaults. Adopting shadcn's `ring` pattern in brand CSS would close the gap cheaply.

6. **Breakpoints don't align.** Brand: 560/640/860. App: Tailwind 640/768/1024/1280/1536. Prototype spec calls for 640/1024. Three different mental models.

7. **Sonner (app toast library) uses its own greyscale palette** (`--gray1..12`), unlinked to either token system.

8. **Newsreader serif** is declared in brand tokens but I couldn't find it in use anywhere on marketing or docs in v1. Either add usage or delete the token.

9. **Theme toggle exists in brand system but not (visibly) in app.** Login page ignored `prefers-color-scheme` at first glance.

10. **App source is not in `vaerksted-ai/*`** (or is in a private repo I can't see). The design system's most important surface has no in-repo source to reference — every future prototype has to reverse-engineer against a running build. Highest-leverage thing to fix.

---

## Deliberately out of scope for v1
- Dark-mode audit of the app.
- Authenticated app surfaces (Bets, Objects, Agents, For You). Need a login.
- Any component/token I couldn't find in code AND couldn't screenshot in a browser.
- Fixing anything. This is inventory.
- Motion tokens (there's nothing formal to catalogue yet).
- Illustration / iconography / social imagery (Visual Designer's turf).

## What v2 should add
- Login and screenshot every authenticated surface at 640 / 1024 / desktop.
- Formal spacing scale + radius scale, aligning both systems.
- Consolidated token map: one `--brand-*` layer that both hand-rolled CSS and shadcn/Tailwind's `--*` tokens map into.
- Focus-state pattern adopted in the brand system.
- Motion tokens (durations + easings, named).
