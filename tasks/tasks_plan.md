# Tasks Plan — Jamie Tucker Portfolio

## Current status

**Milestones 1 and 2 are complete and tested.** The site is a six-page static
portfolio in the Ohio State palette, with unit-tested shared logic, machine-verified
colour contrast, and markup verification. `npm test` runs seven suites: 105
assertions, all passing.

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
- [x] ~~Contrast audit of the light theme~~ — done in Milestone 2 and now enforced
      by `test/color-contrast.test.js` on every run.
- [ ] **Focus-ring contrast on scarlet surfaces**: `:focus-visible` uses
      `--pf-accent`, which is only checked against the page background. Verify it
      against a scarlet button face and add a contract for it.

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
| Token values are duplicated in `theme.css` and `utils/color-contrast.js` | A CSS-only edit could escape the audit | Tests assert the three brand values appear verbatim in `theme.css`; treat the pair as one change |
| Dark-mode links use a scarlet tint, which BUX discourages | Slight brand deviation | Unavoidable: plain scarlet is 2.7:1 on dark ink. Accessibility wins; solid scarlet is retained for filled controls |
| `color-mix()` needs a 2023+ browser | Minor visual degradation on old engines | Tokens still resolve; borders fall back to solid colours |
| No analytics | No visibility into recruiter traffic | Deliberate for now; revisit only with a privacy-respecting option |
