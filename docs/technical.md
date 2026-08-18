# Technical Notes — Jamie Tucker Portfolio

## 1. Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Markup | One hand-written HTML5 document | Crawlable; renders with JS off |
| Styling | Plain CSS + `--pf-*` custom properties | No build step; full control |
| Scripting | ES5-compatible browser JS in IIFEs | Works without transpiling |
| Shared logic | UMD modules in `utils/` | One impl for browser + Node tests |
| Tests | Node + `assert` + `test/lib/test-runner.js` | Node 16 locally |
| Tooling | None required | `npm test` + any static file server |

No Tailwind CDN. Colour scheme is **Ohio State** (scarlet `#ba0c2f`, gray
`#a7b1b7`, white). Milestone 6 changed structure and chrome, not palette.

## 2. Development setup

```bash
npm test          # nine suites via test/run-all.js
npm start         # or: npx serve . / python3 -m http.server
```

Serve from the **repository root**. Asset hrefs/src are document-relative
(`./pages/…`, `./utils/…`, `./media/…`) so GitHub Pages can host the site under
a repository subpath.

## 3. Key technical decisions

### 3.1 Three major sections

| Section | Responsibilities |
| --- | --- |
| `#about` | Pro headshot, résumé CTA, My Story, education pill (degree, affiliations, OSU logo on the right like role pills) |
| `#experience` | Three role pill boxes (P/A/O), compact skills, Away from the Keyboard |
| `#contact` | LinkedIn pill (fastest), Email pill (+ copy) |

### 3.2 YouTube-era structural styling (colour locked)

`--pf-card-shadow`, `--pf-pill-radius`, denser masthead with `--pf-border-strong`,
`.pf-pill-box` content chrome. Scarlet tokens unchanged; pill borders use
`--pf-border-strong` for WCAG 1.4.11.

### 3.3 Soft hash aliases

`SiteNav.HASH_ALIASES` + `canonicalizeHash`; `site.js` `setupHashAliases` uses
`history.replaceState` so `#work` / `#skills` / `#proof` / `#approach` / `#top`
land on live sections.

### 3.4 Professional headshot

`PROFILE.photoPath` and About `<img>` / JSON-LD → `./media/images/pro_headshot.jpeg`.

### 3.5 Content in HTML, data in modules

Edit `resume-data.js` / `role-pills.js` first, then markup. Filters are not loaded
on the page (util may remain for tests / future use).

### 3.6 Document-relative asset paths

Every local `href` / `src` and `PROFILE` media path is `./…` from `index.html`.
Root-absolute paths (`/pages/…`) would 404 on GitHub Pages project URLs
(`https://jamieatucker.github.io/<repo>/`). External URLs (`https://…`) and
in-page hashes (`#about`) stay as they are. `LEGACY_PATHS` keys remain
historical URL pathnames, not asset hrefs.

## 4. Design patterns

- UMD + factory; single sources for nav and résumé; pure core / thin shell.
- Data-attribute contracts (`data-nav-key`, `data-section`, `data-role-pill`,
  `data-copy-email`).
- Skip link chrome lives in `layout.css` only. Centering uses `--pf-header-h`
  so the focused control stays on the nav bar if header height changes.
- `.pf-section` sets `padding-top` only. Never use a `padding` shorthand on it:
  sections also carry `.pf-shell`, and a shorthand would zero the shared
  horizontal gutter that keeps them aligned with `about-hero`.
- Theme-paired logos: both SVGs in the markup; `[data-theme]` in `layout.css`
  shows the `--dark` mark on dark and the `--light` mark on light. YouTube uses
  white/black wordmarks; Education uses `osu_vertical_dark.svg` /
  `osu_vertical_light.svg` (same viewBox, no aspect-ratio lock). No extra JS —
  the existing toggle already writes `data-theme`.

## 5. Constraints

- Static hosting; ES5 browser JS; Node 16 harness; AA contrast.

## 6. Testing strategy

| Suite | Covers |
| --- | --- |
| `resume-data.test.js` | Dates, tags, profile shape |
| `site-nav.test.js` | Three sections, aliases, legacy paths |
| `role-pills.test.js` | Pill shape, orphans, missing roles |
| `experience-filter.test.js` | Tag matching (util retained) |
| `theme-preference.test.js` | Theme resolution |
| `home-sections.test.js` | Active section spy |
| `project-data.test.js` | Case-study provenance |
| `color-contrast.test.js` | WCAG AA contracts |
| `page-markup.test.js` | Markup vs data, headshot, pills, YouTube theme-pair logos, contact, document-relative asset paths |

## 7. Deployment

Any static host of the repository root, including GitHub Pages project sites.
Document-relative asset paths keep CSS, JS, and media loading when the site is
not at the domain root. Fragments `#about`, `#experience`, `#contact` are the
live destinations; aliases rewrite in supporting browsers.
