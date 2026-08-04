# Changelog — Jamie Tucker Portfolio

All notable changes to this project are recorded here, newest first.
This project follows [Semantic Versioning](https://semver.org/) loosely: the site is
private and unversioned, so entries are grouped by date and milestone.

## [1.1.0] — 2026-08-04

### Changed — Milestone 2: Ohio State brand theme, WCAG 2.1 AA verified

**Palette**
- `pages/shared/css/theme.css` now declares the official Ohio State primary
  colours as `:root` brand tokens — `--pf-scarlet: #ba0c2f`, `--pf-gray: #a7b1b7`,
  `--pf-white: #ffffff` — plus the BUX scarlet shades (`dark-40`, `dark-60`), the
  full gray tint and shade ramp, and `--pf-ink` for dark-mode depth.
- Both `[data-theme]` blocks were remapped onto those tokens, replacing the
  previous blue and teal palette. Page CSS was not touched beyond the token
  changes noted below, because it consumes semantic tokens only.
- New tokens `--pf-accent-solid`, `--pf-accent-solid-hover`, and
  `--pf-accent-solid-border` separate *filled* scarlet controls from *accent
  text*. Dark mode needs the split: scarlet is only 2.7:1 on dark ink, so links
  use the `#ff8a9c` tint while buttons keep solid scarlet with white text.
- Primary buttons, the skip link, `::selection`, and active filter chips moved to
  `--pf-accent-solid` so white label text is never placed on a light tint.
- Dark-mode primary buttons gained a scarlet-tint border so the control boundary
  clears WCAG 1.4.11 against the page (solid scarlet alone is 2.7:1).
- Interactive borders (`--pf-border-strong`) darkened to `gray-dark-20` (dark) and
  `gray-dark-40` (light) to clear 3:1 on every surface they appear on.

**Accessibility verification**
- Added `utils/color-contrast.js`: WCAG relative luminance, contrast ratio,
  truncation that refuses to round 4.49 up to a pass, alpha compositing for
  translucent surfaces, the brand palette, the resolved token values for both
  themes, and 16 real foreground/background contracts.
- Added `test/color-contrast.test.js` (21 assertions) auditing all 32 contracts.
  Lowest ratio on the site is now 4.61:1; body text clears AAA in both themes.

**Layout fixes**
- Removed the `pf-brand__role` "Full-Stack Software Engineer" subheader from the
  navigation on all six pages; it wrapped badly on small viewports. `.pf-brand__text`
  is now a single centred line.
- Home page "Four things I shipped" pins to two columns via the new
  `.home-featured` rule, collapsing to one column below 700px. Plain `auto-fit`
  packed three cards across at container width and orphaned the fourth.

**Documentation**
- `docs/osu-brand-theme.md` — 452-word feature overview with a Mermaid diagram.
- `diagrams/theme-token-flow.mmd` — brand token flow and contrast enforcement.
- Updated `tasks/tasks_plan.md`, `tasks/active_context.md`, and
  `.cursor/rules/lessons-learned.mdc`.

## [1.0.0] — 2026-08-04

### Added — Milestone 1: multi-page portfolio architecture

**Pages (6)**
- `index.html` — home page at the repository root with the recruiter hook: one-line
  claim, four-metric proof strip, availability badge, "see my impact" and résumé
  calls to action, three value propositions, four featured projects, career path,
  closing CTA, and `Person` JSON-LD.
- `pages/about/html/about.html` — career story, four working principles, education
  panel, interests.
- `pages/experience/html/experience.html` — newest-first timeline of all three roles
  with every résumé bullet, a technology filter, and `?tech=` deep links.
- `pages/projects/html/projects.html` — eight case studies written as problem /
  approach / outcome, with a technology filter.
- `pages/skills/html/skills.html` — four skill groups with honest depth labels
  (daily driver / production / working knowledge), each technology deep-linking to
  the experience filter.
- `pages/contact/html/contact.html` — email with copy-to-clipboard, LinkedIn,
  résumé download, location, and what I'm looking for.

**Shared chrome**
- `pages/shared/css/theme.css` — all `--pf-*` design tokens, dark and light
  palettes, universal English font stack (Inter over system UI fonts), base
  typography, focus styles, reduced-motion and print handling.
- `pages/shared/css/layout.css` — sticky header, primary nav, buttons, cards, grids,
  tag chips, reveal-on-scroll, prev/next tour, footer, mobile menu.
- `pages/shared/js/theme-init.js` — applies the saved theme before first paint.
- `pages/shared/js/site.js` — active nav marking, mobile menu, theme toggle,
  reveal-on-scroll, tour rendering, footer year.

**Data and logic (`utils/`, UMD: browser global + CommonJS)**
- `resume-data.js` — profile, education, three roles, four skill groups, impact
  metrics, and date helpers (`formatDateRange`, `formatDuration`,
  `getTotalYearsExperience`, `getAllSkillTags`).
- `project-data.js` — eight case studies, featured selection, role provenance, and
  `findOrphanProjects()` referential-integrity guard.
- `site-nav.js` — nav model, `normalizePath`, `resolveActiveNavKey`,
  `getAdjacentLinks` for the tour.
- `experience-filter.js` — `matchesTag`, `filterRolesByTag` with `All` and
  unknown-tag fallback, `sortRolesByRecency`, `countRolesByTag`.
- `theme-preference.js` — `resolveTheme` (saved → OS → dark default), `nextTheme`,
  `describeToggle`.

**Page scripts**
- `pages/experience/js/experience.js` — filter chips, status announcements, `?tech=`
  deep-link support.
- `pages/projects/js/projects.js` — the same filter behaviour for case studies.
- `pages/contact/js/contact.js` — clipboard copy with a legacy `execCommand`
  fallback; the button stays hidden when neither path exists.

**Tests (6 suites, 82 assertions, `npm test`)**
- `test/lib/test-runner.js` — shared assert-based harness (Node 16 has no stable
  `node:test`).
- `resume-data`, `site-nav`, `experience-filter`, `theme-preference`, `project-data`
  unit suites covering malformed input, empty input, casing, and boundary dates.
- `page-markup.test.js` — verifies the hand-written HTML against the data modules,
  that all six pages repeat the nav exactly as `site-nav.js` defines it, that every
  internal link and asset resolves, and that `target="_blank"` always pairs with
  `rel="noopener"`.

**Media**
- `media/docs/jamie-tucker-resume.pdf`, `media/images/profile.jpeg`, favicons.

**Documentation**
- `docs/product_requirement_docs.md`, `docs/architecture.md` (with Mermaid component
  and sequence diagrams), `docs/technical.md`.
- `docs/multi-page-architecture.md` — 451-word feature overview with a Mermaid
  diagram and an editing table.
- `diagrams/site-architecture.mmd` — full site architecture diagram source.
- `README.md`, `tasks/tasks_plan.md`, `tasks/active_context.md`, this changelog.
- `.cursor/rules/lessons-learned.mdc` rewritten for this project;
  `.cursor/rules/error-documentation.mdc` seeded with the issues hit in this build.

### Technical decisions

- Home page lives at the repository root so the canonical recruiter URL is `/`,
  while its stylesheet stays under `pages/index/css/` per the per-page convention.
- No Tailwind CDN and no build step: plain CSS tokens and ES5-safe browser JS.
- All page content is in the HTML; JavaScript only adds filtering, theming, the
  tour, and animation, so the site is complete with JavaScript disabled.
