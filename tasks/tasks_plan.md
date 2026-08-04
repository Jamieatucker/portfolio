# Tasks Plan — Jamie Tucker Portfolio

## Current status

**Milestone 1 (multi-page architecture) is complete and tested.** The site is a
six-page static portfolio with unit-tested shared logic and markup verification.
`npm test` runs six suites: 82 assertions, all passing.

## What works

### Foundation
- [x] `package.json` with `test` and `start` scripts, no dependencies
- [x] Directory structure: `pages/`, `utils/`, `test/`, `docs/`, `tasks/`, `diagrams/`, `media/`
- [x] Media assets: profile photo, favicons, résumé PDF at `/media/docs/jamie-tucker-resume.pdf`
- [x] `README.md` with local preview and editing instructions

### Data and logic layer (`utils/`, all UMD, all unit tested)
- [x] `resume-data.js` — profile, education, three roles, skill groups, impact metrics, date math
- [x] `project-data.js` — eight case studies with role provenance and orphan detection
- [x] `site-nav.js` — nav model, path normalisation, active-key resolution, prev/next tour
- [x] `experience-filter.js` — tag matching, `All`, unknown-tag fallback, sorting, counts
- [x] `theme-preference.js` — saved → OS → default resolution, toggle labels

### Shared chrome (`pages/shared/`)
- [x] `theme.css` — `--pf-*` tokens, dark and light palettes, universal font stack, reduced motion, print styles
- [x] `layout.css` — sticky header, nav, buttons, cards, grids, tags, tour, footer, mobile menu
- [x] `theme-init.js` — pre-paint theme application, adds `.pf-js`
- [x] `site.js` — active nav, mobile menu, theme toggle, reveal on scroll, tour rendering, footer year

### Pages
- [x] Home (`index.html` + `pages/index/css`) — hook, metric strip, value props, four featured projects, career path, CTA, Person JSON-LD
- [x] About — story, four working principles, education panel, interests
- [x] Experience — three-role timeline, all résumé bullets, technology filter, `?tech=` deep links
- [x] Projects — eight problem/approach/outcome cards, technology filter
- [x] Skills — four groups, honest depth labels, deep links into the experience filter
- [x] Contact — email + copy button, LinkedIn, résumé, location, what I'm looking for

### Verification
- [x] Six Node suites via `test/run-all.js`
- [x] `page-markup.test.js` — markup vs data, nav consistency across all six pages, dead-link and `rel=noopener` checks
- [x] Manual HTTP check: all six routes and all assets return 200

### Documentation (Memory Files)
- [x] `docs/product_requirement_docs.md`, `docs/architecture.md`, `docs/technical.md`
- [x] `docs/multi-page-architecture.md` (feature overview, 451 words, with Mermaid)
- [x] `diagrams/site-architecture.mmd`
- [x] `tasks/tasks_plan.md`, `tasks/active_context.md`, `tasks/changelog.md`
- [x] `.cursor/rules/lessons-learned.mdc` and `.cursor/rules/error-documentation.mdc` updated

## What's left to build (backlog, in priority order)

### P1 — before sharing the link widely
- [ ] **Open Graph image.** Add `media/images/og-card.png` (1200×630) and
      `og:image` / `twitter:card` tags so the link previews well on LinkedIn.
- [ ] **Real favicon set for this site.** The current icons are borrowed from the
      sibling project; generate a `JT` monogram set matching this palette.
- [ ] **Lighthouse pass** on all six pages; record scores in `docs/technical.md`.
- [ ] **Contrast audit** of the light theme (`--pf-text-subtle` on `--pf-surface`)
      with an automated checker rather than by eye.

### P2 — content depth
- [ ] Per-project detail pages (`pages/projects/html/<id>.html`) for the three
      strongest case studies, linked from the cards.
- [ ] Testimonial or recommendation quotes on the home page (needs permission).
- [ ] `?tech=` deep links from the projects page (experience page already supports it).

### P3 — engineering polish
- [ ] Extract the repeated header/footer block into a documented HTML partial and a
      build-free include check, or a tiny Node prebuild that stamps them.
- [ ] Add an HTML validator and a link checker to `npm test`.
- [ ] Add a smoke test that boots the pages in a headless browser to cover the DOM
      wiring in `site.js`, which unit tests cannot reach.

## Known issues and risks

| Issue | Impact | Mitigation / plan |
| --- | --- | --- |
| Header/footer markup is duplicated across six pages | Editing the nav means six edits | `page-markup.test.js` fails if any page drifts; P3 item to extract a partial |
| Résumé content exists in both the data module and the markup | Risk of drift | Markup tests assert every string appears; edit the data module first |
| Favicons and profile photo are copied from the sibling project | Slightly off-brand | P1 items above |
| `color-mix()` needs a 2023+ browser | Minor visual degradation on old engines | Tokens still resolve; borders fall back to solid colours |
| No analytics | No visibility into recruiter traffic | Deliberate for now; revisit only with a privacy-respecting option |
