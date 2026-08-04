# Jamie Tucker — Software Engineering Portfolio

A five-page static portfolio built to answer a recruiter's questions in the first
twenty seconds: what I do, who I did it for, and how to reach me.

Hand-written HTML, CSS, and JavaScript. No framework, no build step, no runtime
dependencies.

## Local preview

Serve the repository root — all internal paths are root-absolute, so `file://` will
not resolve CSS or JS.

```bash
npm start          # npx serve .
# or
python3 -m http.server 8099
```

Then open <http://localhost:8099/>.

## Tests

```bash
npm test
```

Eight Node suites covering the shared logic in `utils/`, the WCAG contrast of the
palette, and the static markup against both — including a dead-link check across
every page.

## Structure

```
index.html              home page: the hook + the #experience timeline — served at /
pages/
  shared/css/           theme.css (design tokens) + layout.css (page chrome)
  shared/js/            theme-init.js (pre-paint theme) + site.js (nav, tour, reveal)
  index/css/, index/js/ home page styles + timeline filter, collapse, sub-nav
  about|projects|skills|contact/
                        html/ + css/ (+ js/ where the page has behaviour)
utils/                  UMD data & pure logic, shared by browser and Node tests
test/                   node assert suites, run via test/run-all.js
docs/                   PRD, architecture, technical notes, feature overview
tasks/                  task plan, active context, changelog
diagrams/               Mermaid source for the architecture diagram
media/                  résumé PDF, profile photo, favicons
```

## Editing

| To change | Edit |
| --- | --- |
| A job, bullet, skill, or metric | `utils/resume-data.js`, then the matching page markup |
| A case study | `utils/project-data.js` + `pages/projects/html/projects.html` |
| Colours, spacing, type | `pages/shared/css/theme.css` (tokens only) |
| Header, footer, cards, buttons | `pages/shared/css/layout.css` |
| One page's layout | `pages/<name>/css/<name>.css` |
| Navigation | `NAV_LINKS` in `utils/site-nav.js`, then the nav block on every page |
| Home sub-nav or how many roles start collapsed | `utils/home-sections.js` + the `[data-section]` ids in `index.html` |

Run `npm test` after any content change — the suites name the exact page and string
when markup and data drift apart.

Start with [`docs/multi-page-architecture.md`](docs/multi-page-architecture.md) for a
one-page tour of how the site fits together.

## License

MIT
