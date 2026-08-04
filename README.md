# Jamie Tucker — Software Engineering Portfolio

A single-page static portfolio built to answer a recruiter's questions in the
first twenty seconds: what I do, who I did it for, and how to reach me.

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
palette, and the static markup against both — including a dead-link check and an
assertion that every nav link has a matching section.

## Structure

```
index.html              the whole site: hero + #proof #approach #about #work
                        #experience #skills #contact — served at /
pages/
  shared/css/           theme.css (design tokens) + layout.css (chrome)
  shared/js/            theme-init.js (pre-paint theme) + site.js (section spy,
                        mobile menu, theme toggle, reveal)
  index/css/            index.css, about.css, work.css, skills.css, contact.css
  index/js/             index.js (timeline filter + collapse), work.js (case
                        study filter), contact.js (copy email)
utils/                  UMD data & pure logic, shared by browser and Node tests
test/                   node assert suites, run via test/run-all.js
docs/                   PRD, architecture, technical notes, feature overviews
tasks/                  task plan, active context, changelog
diagrams/               Mermaid source for the architecture diagrams
media/                  résumé PDF, profile photo, favicons
```

## Editing

| To change | Edit |
| --- | --- |
| A job, bullet, skill, or metric | `utils/resume-data.js`, then the matching markup in `index.html` |
| A case study | `utils/project-data.js` + the `#work` section of `index.html` |
| Colours, spacing, type | `pages/shared/css/theme.css` (tokens only) |
| Header, footer, cards, buttons | `pages/shared/css/layout.css` |
| One section's layout | `pages/index/css/<section>.css` |
| Sections and nav links | `SECTIONS` in `utils/site-nav.js`, then the nav block and the `<section id>` in `index.html` |
| How many roles start collapsed, or when the nav switches sections | `utils/home-sections.js` |

Run `npm test` after any content change — the suites name the exact section and
string when markup and data drift apart.

Start with [`docs/single-page-architecture.md`](docs/single-page-architecture.md)
for a short tour of how the site fits together.

## License

MIT
