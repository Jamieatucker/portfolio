# Tasks Plan — Jamie Tucker Portfolio

## Current status

**Milestones 1–5 are complete and tested.** The site is a single-page static
portfolio in the Ohio State palette, with unit-tested shared logic, machine-verified
colour contrast, and markup verification. `index.html` carries the hero and seven
sections; the header nav jumps between them. `npm test` runs eight suites, all
passing.

### Milestone 5 — single-page architecture (done)
- [x] About, Projects, Skills, and Contact folded into `index.html` as `#about`,
      `#work`, `#skills`, `#contact`; their page directories deleted
- [x] `utils/site-nav.js` rewritten as a section model with a `LEGACY_PATHS` map;
      `test/site-nav.test.js` covers nine cases
- [x] `site.js` marks the section in view and drops the prev/next tour; the
      sticky sub-nav retired in favour of the header nav
- [x] Section CSS and JS relocated under `pages/index/`; both filters scoped to
      their own containers so they cannot capture each other's chips
- [x] Skills rows filter the timeline in place via `data-tech`
- [x] `test/page-markup.test.js` rewritten for one page (29 assertions)
- [x] `docs/single-page-architecture.md` + `diagrams/single-page-architecture.mmd`

### Milestone 4 — home page length controls and naming (done)
- [x] `utils/home-sections.js` — `resolveActiveSection`, `limitRoles`,
      `describeRoleToggle`; `test/home-sections.test.js` covers 10 cases
- [x] Sticky section sub-nav with `aria-current` scroll-spy, plain anchors first
- [x] Earlier roles collapsed behind a filter-aware toggle that ships `hidden`
- [x] `exp-*` classes renamed to `home-*`; the markup test guards the rename
- [x] `--pf-header-h` token so the header height has one source
- [x] `docs/home-page-length-controls.md` + updated `diagrams/home-timeline-flow.mmd`

### Milestone 3 — home consolidation and grid parity (done)
- [x] Full work-history timeline (bullets, tags, technology filter) moved into
      `index.html#experience`; `pages/experience/` deleted
- [x] `experience.js` → `pages/index/js/index.js`; timeline CSS → `index.css`
- [x] `site-nav.js` reduced to five routes; nav, footer, and tour follow
- [x] Skills deep links repointed to `/index.html?tech=`; the filter scrolls the
      timeline into view
- [x] `pf-grid--2/3/4` pin fixed columns and span an odd trailing card, so no card
      is ever alone on a row; `projects.js` marks the last visible card
- [x] Contact: LinkedIn first and labelled fastest, Location card removed and its
      content folded into "What I'm looking for"
- [x] `docs/home-timeline-and-grid-parity.md` + `diagrams/home-timeline-flow.mmd`

### Milestone 2 — Ohio State brand theme (done)
- [x] Brand tokens in `theme.css` `:root`: scarlet `#ba0c2f`, gray `#a7b1b7`, white
      `#ffffff`, plus BUX scarlet shades and the full gray ramp
- [x] Dark and light themes remapped onto brand tokens, no raw colours in page CSS
- [x] `--pf-accent-solid` / `-hover` / `-border` split so filled controls keep white
      text on solid scarlet while dark-mode links use an accessible tint
- [x] `utils/color-contrast.js` + `test/color-contrast.test.js`: 32 contracts, all
      passing WCAG 2.1 AA, lowest ratio 4.61:1
- [x] Nav subheader removed from all six pages (broke small viewports)
- [x] Home "Four things I shipped" pinned to two columns per row
- [x] `docs/osu-brand-theme.md` + `diagrams/theme-token-flow.mmd`

## What works

### Foundation
- [x] `package.json` with `test` and `start` scripts, no dependencies
- [x] Directory structure: `pages/`, `utils/`, `test/`, `docs/`, `tasks/`, `diagrams/`, `media/`
- [x] Media assets: profile photo, favicons, résumé PDF at `/media/docs/jamie-tucker-resume.pdf`
- [x] `README.md` with local preview and editing instructions

### Data and logic layer (`utils/`, all UMD, all unit tested)
- [x] `resume-data.js` — profile, education, three roles, skill groups, impact metrics, date math
- [x] `project-data.js` — eight case studies with role provenance and orphan detection
- [x] `site-nav.js` — section model, hash normalisation, order, adjacency, legacy page map
- [x] `experience-filter.js` — tag matching, `All`, unknown-tag fallback, sorting, counts
- [x] `theme-preference.js` — saved → OS → default resolution, toggle labels

### Shared chrome (`pages/shared/`)
- [x] `theme.css` — `--pf-*` tokens, dark and light palettes, universal font stack, reduced motion, print styles
- [x] `layout.css` — sticky header, nav, buttons, cards, grids, tags, footer, mobile menu
- [x] `theme-init.js` — pre-paint theme application, adds `.pf-js`
- [x] `site.js` — section spy, mobile menu, theme toggle, reveal on scroll, footer year

### Sections (all in `index.html`, styled from `pages/index/`)
- [x] Hero — hook, availability, both CTAs, Person JSON-LD
- [x] `#proof` — four impact metrics; `#approach` — what I'm brought in to do
- [x] `#about` — story, four working principles, education panel, interests
- [x] `#work` — eight problem/approach/outcome cards, technology filter
- [x] `#experience` — three-role timeline, technology filter, `?tech=` deep links, collapse
- [x] `#skills` — four groups, honest depth labels, rows that filter the timeline
- [x] `#contact` — LinkedIn (fastest), email + copy button, résumé

### Verification
- [x] Eight Node suites via `test/run-all.js`
- [x] `page-markup.test.js` — markup vs data, nav vs section targets, document order, one `h1`, unique ids, grid parity, contact ordering, dead-link and `rel=noopener` checks
- [x] Manual HTTP check: `/` and every relocated asset return 200

### Documentation (Memory Files)
- [x] `docs/product_requirement_docs.md`, `docs/architecture.md`, `docs/technical.md`
- [x] `docs/single-page-architecture.md` (feature overview, with Mermaid); `docs/multi-page-architecture.md` kept as the superseded record
- [x] `diagrams/single-page-architecture.mmd`
- [x] `tasks/tasks_plan.md`, `tasks/active_context.md`, `tasks/changelog.md`
- [x] `.cursor/rules/lessons-learned.mdc` and `.cursor/rules/error-documentation.mdc` updated

## What's left to build (backlog, in priority order)

### P1 — before sharing the link widely
- [ ] **Open Graph image.** Add `media/images/og-card.png` (1200×630) and
      `og:image` / `twitter:card` tags so the link previews well on LinkedIn.
- [ ] **Real favicon set for this site.** The current icons are borrowed from the
      sibling project; generate a `JT` monogram set matching this palette.
- [ ] **Lighthouse pass** on the page; record scores in `docs/technical.md`. Worth
      re-checking the payload now that everything loads at once.
- [x] ~~Contrast audit of the light theme~~ — done in Milestone 2 and now enforced
      by `test/color-contrast.test.js` on every run.
- [ ] **Focus-ring contrast on scarlet surfaces**: `:focus-visible` uses
      `--pf-accent`, which is only checked against the page background. Verify it
      against a scarlet button face and add a contract for it.

### P2 — content depth
- [ ] Per-project detail pages for the three strongest case studies. These would
      be the first documents besides `index.html`; decide first whether a detail
      view should instead expand in place.
- [ ] Testimonial or recommendation quotes on the home page (needs permission).
- [ ] `?tech=` deep links into the `#work` filter (the timeline already supports it).
- [x] ~~The home page is now long~~ — Milestone 4 shipped both the sticky sub-nav
      and the collapse for older roles.

### P3 — engineering polish
- [x] ~~Extract the repeated header/footer block~~ — moot: there is one document,
      so the block exists once.
- [ ] Add an HTML validator and a link checker to `npm test`.
- [ ] Add a smoke test that boots the page in a headless browser to cover the DOM
      wiring in `site.js`, the nav scroll-spy, and both filters, which unit tests
      cannot reach. This matters more now that two filters share hook names.
- [ ] `index.html` is ~800 lines. It is still readable because each section is
      fenced by a comment, but consider a tiny build step if it doubles.

## Known issues and risks

| Issue | Impact | Mitigation / plan |
| --- | --- | --- |
| `index.html` is ~800 lines of hand-written markup | Harder to scan than five smaller files | Every section is fenced by a comment and owns its CSS file; `page-markup.test.js` fails if the markup drifts from the data or the nav |
| Two filters share hook names on one page | A document-wide `querySelector` would cross them | Both scripts resolve hooks inside their own container, and the markup suite asserts it |
| Résumé content exists in both the data module and the markup | Risk of drift | Markup tests assert every string appears; edit the data module first |
| Favicons and profile photo are copied from the sibling project | Slightly off-brand | P1 items above |
| Token values are duplicated in `theme.css` and `utils/color-contrast.js` | A CSS-only edit could escape the audit | Tests assert the three brand values appear verbatim in `theme.css`; treat the pair as one change |
| Dark-mode links use a scarlet tint, which BUX discourages | Slight brand deviation | Unavoidable: plain scarlet is 2.7:1 on dark ink. Accessibility wins; solid scarlet is retained for filled controls |
| `color-mix()` needs a 2023+ browser | Minor visual degradation on old engines | Tokens still resolve; borders fall back to solid colours |
| No analytics | No visibility into recruiter traffic | Deliberate for now; revisit only with a privacy-respecting option |
