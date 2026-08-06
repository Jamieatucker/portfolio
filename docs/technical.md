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

Serve from the **repository root**. Paths are root-absolute.

## 3. Key technical decisions

### 3.1 Three major sections

| Section | Responsibilities |
| --- | --- |
| `#about` | Pro headshot, résumé CTA, How I Got Here, Farley triad + proof bullets, education |
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

`PROFILE.photoPath` and About `<img>` / JSON-LD → `/media/images/pro_headshot.jpeg`.

### 3.5 Content in HTML, data in modules

Edit `resume-data.js` / `role-pills.js` first, then markup. Filters are not loaded
on the page (util may remain for tests / future use).

## 4. Design patterns

- UMD + factory; single sources for nav and résumé; pure core / thin shell.
- Data-attribute contracts (`data-nav-key`, `data-section`, `data-role-pill`,
  `data-copy-email`).

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
| `page-markup.test.js` | Markup vs data, headshot, pills, contact |

## 7. Deployment

Any static host at the repository root. Fragments `#about`, `#experience`,
`#contact` are the live destinations; aliases rewrite in supporting browsers.
