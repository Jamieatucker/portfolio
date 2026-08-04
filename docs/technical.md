# Technical Notes — Jamie Tucker Portfolio

## 1. Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Markup | One hand-written HTML5 document | Content is crawlable and renders with JS off |
| Styling | Plain CSS with custom properties | No build step, no framework payload, full control |
| Scripting | ES5-compatible browser JS in IIFEs | Works everywhere without transpiling |
| Shared logic | UMD modules in `utils/` | One implementation for browser and Node tests |
| Tests | Node + `assert` + a 40-line runner | Node 16 on this machine predates stable `node:test` |
| Tooling | None required | `npm test` and any static file server |

There is **no Tailwind CDN** on this site, unlike the sibling `PersonalWebsite`
project. A recruiter-facing page should not depend on a third-party script to look
correct, and the token system in `theme.css` covers what Tailwind was doing there.

## 2. Development setup

```bash
# from the Portfolio directory
npm test          # run all eight test suites
npx serve .       # or: python3 -m http.server 8099
```

Serve from the **repository root**. All internal references are root-absolute
(`/pages/...`, `/media/...`, `/utils/...`), so opening the file directly from the
filesystem with `file://` will not resolve CSS or JS.

## 3. Key technical decisions

### 3.1 One page at the repository root

`index.html` sits at the root and is the entire site: every former page is a
`<section>` in it, and the nav moves between sections by fragment. Its CSS and JS
live under `pages/index/`, one file per section (`about.css`, `work.css`,
`skills.css`, `contact.css`, `work.js`, `contact.js`), so the assets stay as
separable as the sections are.

The trade accepted here: the whole site is one HTTP response, which is a larger
first payload than a single page of a multi-page site, but there is no navigation
cost afterwards and no repeated header/footer markup to keep in sync. At this
content volume the page is still well under the size of one photograph.

Old page URLs (`/pages/about/html/about.html` and friends) are gone rather than
redirected: the site had not been shared publicly, so no bookmarks exist.
`SiteNav.LEGACY_PATHS` records where each one's content went, and the markup test
uses it to prove nothing still links to a retired path.

### 3.2 Content in HTML, data in modules

Content is duplicated between `utils/resume-data.js` and the page markup. That is a
conscious trade: JS-rendered content would break for no-JS visitors and delay the
hook for everyone. `test/page-markup.test.js` removes the risk by asserting that
every role, highlight, date range, metric, project, and skill in the data modules
appears in the rendered HTML. Edit the data module first, then the markup, and let
the tests point out what you missed.

### 3.3 Universal font stack

```css
--pf-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

Inter is loaded from Google Fonts with `display=swap` and two `preconnect` hints.
If it fails, the platform UI font renders at the same metrics-friendly sizes. Base
size is `1.0625rem` at `1.65` line height with a `68ch` measure — comfortable for
sustained reading on a laptop.

### 3.4 Theme without a flash

`theme-preference.js` (pure, tested) resolves saved choice → OS preference →
dark default. `theme-init.js` runs **synchronously in `<head>`** to set
`data-theme` and add `.pf-js` before first paint. Because `.pf-js` gates the reveal
animation and the mobile menu collapse, a visitor without JS never gets hidden
content.

### 3.5 Progressive enhancement for filters

Roles and projects are in the HTML with their tags in `data-role-tags` /
`data-project-tags`. The filter UI ships `hidden` and is unhidden by script. An
unknown or empty tag returns **all** items rather than an empty list, so a stale
deep link degrades to the full page.

## 4. Design patterns in use

- **UMD module + factory** for every shared helper (browser global or CommonJS).
- **Single source of truth** for the nav (`site-nav.js`) and résumé (`resume-data.js`).
- **Pure core, thin shell**: decisions live in `utils/`; DOM code only wires them.
- **Data attribute contracts** (`data-nav-key`, `data-section`, `data-role-tags`,
  `data-tech`, `data-copy-email`) so CSS and JS never depend on class names for
  behaviour. Hooks shared by two sections (`data-filter-chips`) are always
  resolved inside their own container, never document-wide.
- **Referential integrity check** (`findOrphanProjects`) instead of trusting comments.

## 5. Constraints

- Static hosting only: no server code, no directory listing, no contact form.
- ES5-safe browser syntax (`var`, no arrow functions) in files that ship to the
  browser; test files may use modern Node syntax.
- Node 16 locally, so tests avoid `node:test` and `structuredClone`.
- `color-mix()` and `aspect-ratio` are used for polish; both degrade acceptably in
  older engines (borders fall back to the token colour, images to intrinsic ratio).

## 6. Testing strategy

| Suite | Covers |
| --- | --- |
| `resume-data.test.js` | Date math, duration formatting, tag de-duplication, data shape |
| `site-nav.test.js` | Hash normalisation, section resolution, order, adjacency, legacy paths |
| `experience-filter.test.js` | Tag matching, `All`, unknown tags, sorting, counts |
| `theme-preference.test.js` | Resolution order, corrupt storage, toggle labels |
| `home-sections.test.js` | Active-section thresholds, page bottom, role collapse, toggle labels |
| `project-data.test.js` | Case-study shape, provenance, orphan detection |
| `page-markup.test.js` | Markup vs data, nav vs sections, unique ids, dead links, `rel=noopener` |

Run everything with `npm test`; `test/run-all.js` exits non-zero if any suite fails.

## 7. Deployment

Any static host (GitHub Pages, Netlify, Cloudflare Pages, S3) serving the repository
root. No environment variables, no redirects required beyond the host's default
`index.html` handling. Since the site is one document, a host-level 404 rule is
optional: every route a visitor can reach from the page is a fragment of `/`.
