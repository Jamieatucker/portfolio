# Jamie Tucker — Software Engineering Portfolio

A single-page static portfolio to showcase my career journey.

Developed in HTML, CSS, and JavaScript. No framework, no build step, no runtime
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

Nine Node suites covering the shared logic in `utils/`, WCAG contrast of the
palette, role pill integrity, and static markup against the data modules —
including dead-link checks and soft-alias coverage.

## Structure

```
index.html              About · Experience · Contact — served at /
pages/
  shared/css/           theme.css (tokens) + layout.css (chrome, pf-pill-box)
  shared/js/            theme-init.js + site.js (hash aliases, section spy, …)
  index/css/            index.css, about.css, contact.css
  index/js/             contact.js (copy email)
utils/                  UMD data & pure logic (resume-data, role-pills, site-nav, …)
test/                   node assert suites via test/run-all.js
docs/                   PRD, architecture, technical notes, feature overviews
tasks/                  task plan, active context, changelog
diagrams/               Mermaid sources
media/                  résumé PDF, pro_headshot.jpeg, favicons
```

## Editing

| To change | Edit |
| --- | --- |
| Story, triad, metrics, skills, profile photo | `utils/resume-data.js`, then matching markup in `index.html` |
| Role pill P/A/O copy | `utils/role-pills.js` + Experience articles in `index.html` |
| Colours, spacing, type, pill shadow | `pages/shared/css/theme.css` (tokens only; keep brand colours) |
| Header, footer, pills, buttons | `pages/shared/css/layout.css` |
| One section's layout | `pages/index/css/<section>.css` |
| Sections, nav, hash aliases | `utils/site-nav.js` + nav / `<section id>` in `index.html` |

Run `npm test` after any content change.

Start with [`docs/recruiter-concise-consolidation.md`](docs/recruiter-concise-consolidation.md)
for Milestone 6, or [`docs/architecture.md`](docs/architecture.md) for the full picture.

## License

MIT
