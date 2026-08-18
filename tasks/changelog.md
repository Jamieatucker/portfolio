# Changelog — Jamie Tucker Portfolio

All notable changes to this project are recorded here, newest first.
This project follows [Semantic Versioning](https://semver.org/) loosely: the site is
private and unversioned, so entries are grouped by date and milestone.

## [2.1.6] — 2026-08-18

### Fixed

- `.pf-section` uses `padding-top` only so it no longer zeroes `.pf-shell`
  left/right padding. My Story, Education, Experience, and Contact now share
  the about-hero gutter on narrow viewports.

## [2.1.5] — 2026-08-18

### Fixed

- Education OSU mark is a theme pair: `osu_vertical_dark.svg` in dark mode,
  `osu_vertical_light.svg` in light mode. Reuses `.pf-theme-logo--*` (no
  aspect-ratio lock; both files already share a viewBox).

## [2.1.4] — 2026-08-18

### Fixed

- Light-theme YouTube wordmark is the same drawing as the dark mark (shared
  viewBox and aspect ratio), so the Playables logo does not shrink when the
  recruiter toggles to light mode.

## [2.1.3] — 2026-08-18

### Fixed

- YouTube Playables logo is a theme pair: white SVG in dark mode, black SVG in
  light mode. Toggle writes `data-theme`; CSS picks the legible mark. Black
  wordmark viewBox cropped so it fills the pill like the white mark.

## [2.1.2] — 2026-08-18

### Changed

- Education pill is one row (degree · affiliations · OSU logo). The logo uses
  the same contain / `max-width: 13rem` chrome as Experience role pills. A
  labelled **Affiliations** list names NSBE, Lambda Psi, and Morrill Scholars.

## [2.1.1] — 2026-08-18

### Changed

- `.pf-skip-link` is centered on the sticky nav bar when focused (`left: 50%`,
  `top: calc(var(--pf-header-h) / 2)`, `translate(-50%, -50%)`). Padding, color,
  type, and off-screen hide motion are unchanged.

## [2.1.0] — 2026-08-06

### Added — Milestone 6: Recruiter Concise Consolidation

**Three-section page**
- `index.html` is About → Experience → Contact. The former hero, proof strip,
  approach cards, eight case studies, verbose timeline, and skills page are
  folded or removed for a shorter recruiter skim.
- About merges the hero (claim, availability, résumé CTA), concise How I Got Here,
  a Farley-style triad using the “What I do” titles with proof metrics as bullets,
  and a compact education panel. Professional headshot:
  `/media/images/pro_headshot.jpeg`.
- Experience uses three YouTube-inspired role pill boxes (problem / approach /
  outcome) for Playables, Search Intelligence, and Modern Creators; compact
  skills-by-category; Away from the Keyboard without CTAs.
- Contact is LinkedIn (fastest) + Email pills only.

**Data and navigation**
- `utils/role-pills.js` — pill model with orphan / missing-role helpers.
- `utils/site-nav.js` — three `SECTIONS`; `HASH_ALIASES` soft-map `#top`,
  `#proof`, `#approach` → `#about` and `#work`, `#skills` → `#experience`.
- `resume-data.js` — `photoPath` + `APPROACH_TRIAD`.
- `site.js` — `setupHashAliases()` via `history.replaceState`.

**Styling**
- `.pf-pill-box`, `--pf-card-shadow`, `--pf-pill-radius`, denser masthead.
- Ohio State colour tokens unchanged.

**Tests and docs**
- `test/role-pills.test.js`; site-nav and page-markup suites rewritten.
- `docs/recruiter-concise-consolidation.md`;
  `diagrams/recruiter-concise-consolidation.mmd`.
- Memory Files and this changelog updated.

### Removed
- Technology filter UIs and their page script loads (`index.js`, `work.js`,
  `experience-filter.js` no longer referenced from the document).
- Contact résumé channel; Engineer first intro; interests-section CTAs.

## [2.1.0-plan] — 2026-08-06

### Planned — Milestone 6: Recruiter Concise Consolidation

Memory Files initialized for the feature before ACT MODE. Superseded by `[2.1.0]`
implementation above.

## [2.0.0] — 2026-08-04

### Changed — Milestone 5: single-page architecture

**The site is now one page**
- `index.html` holds the hero plus seven sections in this order: `#proof`,
  `#approach`, `#about`, `#work`, `#experience`, `#skills`, `#contact`. The
  About, Projects, Skills, and Contact pages were folded in whole, keeping the
  layout they already had, and `pages/about/`, `pages/projects/`,
  `pages/skills/`, and `pages/contact/` were deleted.
- Every page `<h1>` became the `<h2>` that opens its section; the hero keeps the
  only `h1` on the page.
- The home page's standalone `#education` block was dropped in favour of the
  richer education panel that came with the About page, and the About portrait
  was dropped because the hero already carries the same photo.
- The projects page's closing "Want the detail?" call to action was dropped; the
  `#contact` section now ends the page.

**Navigation**
- `utils/site-nav.js` was rewritten from a page model into a section model:
  an ordered `SECTIONS` list of `{ key, label, hash }`, plus `normalizeHash`,
  `getSection`, `resolveSectionKey`, `getSectionKeys`, `getAdjacentSections`,
  and a `LEGACY_PATHS` map recording where each retired page's content went.
- Header nav links are fragments; the brand returns to `#top`; the footer repeats
  the section links.
- `pages/shared/js/site.js` replaced page-based `aria-current` with a scroll-spy
  built on `HomeSections.resolveActiveSection` and the live header height, and
  the mobile menu now closes itself when a link is clicked.
- The prev/next page tour is gone: `setupTour`, the `[data-tour]` containers, and
  the `.pf-tour*` rules in `layout.css`.
- The sticky home sub-nav is gone too — the header nav points at the same
  sections, and two bars of identical links was one too many.

**Section assets**
- `pages/index/css/` now holds `index.css`, `about.css`, `work.css` (was
  `projects.css`), `skills.css`, and `contact.css`; `pages/index/js/` holds
  `index.js`, `work.js` (was `projects.js`), and `contact.js`.
- Nav links lose padding between 801px and 1040px so seven labels plus the brand
  fit before the mobile menu takes over at 800px.

**Filters**
- Both filters live on one page now, so each script resolves `data-filter-chips`
  and `data-filter-status` inside its own container. A document-wide lookup would
  have handed the timeline the work grid's chips.
- Skills rows filter the timeline in place through `data-tech`, falling back to a
  plain `#experience` jump when JavaScript is off. `?tech=` still deep-links.

### Added
- `docs/single-page-architecture.md` — feature overview with a Mermaid diagram.
- `diagrams/single-page-architecture.mmd`.
- `test/site-nav.test.js` rewritten: nine cases over hash normalisation, section
  resolution, labels, document order, adjacency, and legacy paths.
- `test/page-markup.test.js` rewritten for one page: 29 assertions including nav
  links vs `[data-section]` targets, document order, exactly one `h1`, unique ids
  across the merged markup, both filter hooks scoped, and no link to a retired
  page path.

### Removed
- `diagrams/site-architecture.mmd` (replaced by the single-page diagram).
- `docs/multi-page-architecture.md` is kept but marked superseded.

### Fixed
- The portfolio case study described itself as a "multi-page static site" in
  `utils/project-data.js` and the markup; it is single-page now.

## [1.3.1] — 2026-08-04

### Fixed
- The "Read the case studies" button at the end of the home page's selected-work
  section was left-aligned while the timeline's "Show 2 earlier roles" button was
  centred. `.home-more` now centres too, so the two section-closing buttons share
  an axis.
- The YouTube Playables role read "1 yr 9 mo" against dates of Oct 2025 – Jul
  2026, which is 9 months. The tenure is hand-written next to the dates, so
  `test/page-markup.test.js` now compares every role's duration against
  `Resume.formatDuration(role.start, role.end)` and the contradiction cannot
  return.

### Changed
- The Playables case study is now "Playables Game Creation" (was "Playables Game
  Creation Client") in `utils/project-data.js`, `index.html`, and
  `pages/projects/html/projects.html`.

## [1.3.0] — 2026-08-04

### Added — Milestone 4: home page length controls

**Sticky section sub-nav**
- `index.html` gained a `[data-home-subnav]` bar under the header with five jump
  links — Proof, What I do, Selected work, Experience, Education — and each target
  section now carries an `id` plus `data-section`.
- `pages/index/js/index.js` marks the section in view with `aria-current="true"`,
  re-measuring section tops on each painted frame because the collapse and the
  filter both move them. The links are plain anchors, so they work without
  JavaScript and before the script runs.
- `pages/index/css/index.css` styles the bar and pins it with
  `top: var(--pf-header-h)`; `[data-section]` gets `scroll-margin-top` so a jump
  link does not land behind the two sticky bars. The label is dropped below 620px
  and the whole bar is hidden in print.
- New `--pf-header-h: 4rem` token in `pages/shared/css/theme.css` is now the one
  source for the header height, consumed by `layout.css` and `index.css`.

**Collapsed earlier roles**
- The timeline opens with the newest role only and a "Show 2 earlier roles"
  button. Applying a technology filter overrides the collapse, since a filtered
  view was explicitly requested. The status line reports what is hidden.
- The button ships with the `hidden` attribute, so with JavaScript disabled every
  role stays on the page and no dead control appears.

**New pure logic and tests**
- `utils/home-sections.js` (UMD) holds `resolveActiveSection`, `limitRoles`, and
  `describeRoleToggle`, plus `COLLAPSED_ROLE_COUNT`.
- `test/home-sections.test.js` covers 10 cases: activation thresholds against the
  sticky offset, the page-bottom case where a short trailing section never clears
  the offset, filter-overrides-collapse, defensive handling of empty and negative
  input, and every toggle label. Registered in `test/run-all.js` (eight suites).

### Changed
- The timeline's `exp-*` classes — inherited from the deleted experience page —
  were renamed to `home-*` (`home-role`, `home-timeline`, `home-chip`,
  `home-filter`, `home-education`) across `index.html`,
  `pages/index/css/index.css`, and `pages/index/js/index.js`.
- `test/page-markup.test.js` gained four checks: `home-sections.js` is loaded, no
  page or home asset carries an `exp-` class, every `data-subnav-link` has both an
  `href` and a matching `[data-section]` target, and the role toggle ships hidden
  and expanded.
- Added `docs/home-page-length-controls.md`; updated
  `diagrams/home-timeline-flow.mmd`, `diagrams/site-architecture.mmd`,
  `docs/architecture.md`, `docs/technical.md`,
  `docs/multi-page-architecture.md`, `README.md`, and the task files.

## [1.2.0] — 2026-08-04

### Changed — Milestone 3: home page holds the proof, grids never orphan a card

**Work history moved to the home page**
- `index.html` replaced the thin "Career path" list (dates and titles only) with
  the complete timeline under `id="experience"`: all three roles, every résumé
  bullet, technology tags, and the technology filter. An education panel follows.
- `pages/experience/` was deleted. `experience.js` became
  `pages/index/js/index.js` unchanged, and the timeline CSS moved into
  `pages/index/css/index.css`. The `exp-*` class names were kept so the markup,
  CSS, and JS still read as one block.
- `utils/site-nav.js` dropped the `experience` entry, which shrinks the header
  nav, footer sitemap, and prev/next tour to five pages automatically.
- `pages/skills/html/skills.html` now deep-links to `/index.html?tech=<Tech>`
  (12 links). `index.js` scrolls the timeline into view when it honours a `?tech=`
  parameter, since the timeline sits far below the hero.
- `pages/about/html/about.html` "See the work history" points at
  `/index.html#experience`; the home hero CTA points at `#experience`.

**Card grid parity**
- `pf-grid--2`, `--3`, and `--4` in `pages/shared/css/layout.css` pin fixed column
  counts instead of `auto-fit`, which used to pick a count from available width
  and leave one card alone on the last row (the About page's fourth principle,
  "Accessibility is table stakes", was the visible symptom).
- A trailing card at an odd index spans `1 / -1`, so a genuinely odd grid — the
  Contact page now has three channels — reads as intentional.
- `projects.js` adds `.is-last-visible` to the real trailing card after
  filtering, because `:last-child` still counts hidden cards.
- `.home-featured` was removed; the shared `pf-grid--2` rule covers it.

**Contact page**
- LinkedIn is the first card and carries the "fastest" label with the primary
  button; email is second with a secondary button. The page lead was reworded.
- The "Location / Sunnyvale, California" card was removed; the location, time
  zone, and on-site/hybrid/remote stance moved into the "What I'm looking for"
  panel so no information was lost.

**Tests, docs, diagrams**
- `test/page-markup.test.js` gained five checks: the retired route is gone and
  unlinked, the home page carries the filter hooks and scripts, grids pin two
  columns with an odd-card fallback, every grid holds at least two cards,
  LinkedIn precedes email and is labelled fastest, and the location survives as
  prose. Existing timeline assertions were repointed from `experience` to `home`.
- `test/site-nav.test.js` asserts the five-page tour and that the experience key
  and path resolve to nothing.
- Added `docs/home-timeline-and-grid-parity.md` (feature overview, Mermaid) and
  `diagrams/home-timeline-flow.mmd`; updated `docs/architecture.md`,
  `docs/product_requirement_docs.md`, `docs/multi-page-architecture.md`,
  `diagrams/site-architecture.mmd`, and `README.md`.

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
