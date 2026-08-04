# Changelog — Jamie Tucker Portfolio

All notable changes to this project are recorded here, newest first.
This project follows [Semantic Versioning](https://semver.org/) loosely: the site is
private and unversioned, so entries are grouped by date and milestone.

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
