# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-04_

## Current work focus

Milestones 1–4 are done: the architecture is built, the site wears the Ohio State
palette with contrast verified by tests, and the home page is now the single proof
surface — it carries the full work history, so the site is five pages. That page's
length is managed by a sticky section sub-nav and a collapse for older roles.

Nothing is in flight. The next work item is the P1 backlog in
[`tasks_plan.md`](tasks_plan.md): the Open Graph image, a scarlet favicon set, a
Lighthouse pass, and a focus-ring contract for rings drawn on scarlet buttons.

## Recent changes — Milestone 4 (home page length controls, naming)

1. **Sticky section sub-nav** on the home page: five jump links (Proof, What I do,
   Selected work, Experience, Education) that mark the section in view with
   `aria-current`. Plain anchors, so they work without JavaScript.
2. **Earlier roles collapse.** The timeline opens with the newest role and a
   "Show 2 earlier roles" button. A technology filter overrides the collapse, and
   the button ships `hidden` so no-JS readers keep every role.
3. **`utils/home-sections.js`** holds the arithmetic — `resolveActiveSection`,
   `limitRoles`, `describeRoleToggle` — with 10 unit tests, including the page
   bottom case where a short trailing section never clears the sticky offset.
4. **`exp-*` → `home-*`** across the timeline markup, CSS, and JS; the markup test
   now fails if an `exp-` class reappears.
5. **`--pf-header-h`** in `theme.css` is the single source for the header height,
   consumed by `layout.css` and by the sub-nav's `position: sticky; top`.
6. **Docs.** `docs/home-page-length-controls.md`, and
   `diagrams/home-timeline-flow.mmd` now shows both controls.

## Earlier changes — Milestone 3 (home consolidation, grid parity)

1. **The Experience page is gone.** Its timeline — all bullets, tags, and the
   technology filter — now lives at `index.html#experience`; its script became
   `pages/index/js/index.js` and its CSS moved into `pages/index/css/index.css`.
   `site-nav.js` lost the route, so the nav, footer, and tour shrank to five pages
   without touching page markup beyond the removed links.
2. **Skills deep links repointed** to `/index.html?tech=<Tech>`, and `index.js`
   scrolls the timeline into view when it honours the parameter.
3. **Grid parity.** `pf-grid--2/3/4` pin fixed column counts and span an odd
   trailing card across the row, so no card is ever stranded alone. `projects.js`
   marks the real last visible card because `:last-child` counts hidden ones.
4. **Contact.** LinkedIn is first and labelled fastest; the Location card was
   removed and its content folded into the "What I'm looking for" panel.
5. **Docs.** `docs/home-timeline-and-grid-parity.md` and
   `diagrams/home-timeline-flow.mmd`.

## Earlier changes — Milestone 2 (brand theme)

1. **Brand tokens.** `theme.css` `:root` now holds scarlet `#ba0c2f`, gray
   `#a7b1b7`, white `#ffffff`, the BUX scarlet shades, the gray ramp, and
   `--pf-ink`. Both theme blocks map onto them; page CSS names no raw colours.
2. **Accent split.** `--pf-accent` is theme-aware *text* colour; `--pf-accent-solid`,
   `-hover`, and `-border` drive filled controls. This exists because scarlet is
   only 2.7:1 on dark ink, so dark mode links use the `#ff8a9c` tint while buttons
   keep solid scarlet with white text at 6.6:1.
3. **Contrast is now a test.** `utils/color-contrast.js` plus
   `test/color-contrast.test.js` audit 32 pairs against WCAG 2.1 AA; the lowest
   ratio on the site is 4.61:1.
4. **Nav subheader removed** from every page, and the home page's four featured
   cards pinned to a 2×2 grid.
5. **Docs.** `docs/osu-brand-theme.md` (452 words, Mermaid) and
   `diagrams/theme-token-flow.mmd`.

## Earlier changes — Milestone 1 (architecture)

1. **Data layer.** Five UMD modules in `utils/` hold the résumé, the case studies,
   the nav model, the filter logic, and theme resolution.
2. **Shared chrome.** `theme.css` (tokens, dark + light, universal font stack) and
   `layout.css` (header, cards, footer, tour) plus `theme-init.js` and `site.js`.
3. **Six pages.** Root `index.html` as the home page, and `about`, `experience`,
   `projects`, `skills`, `contact` under `pages/<name>/html/`. (Experience was
   folded into the home page in Milestone 3.)
4. **Six test suites.** Five unit suites plus `page-markup.test.js`, which verifies
   the hand-written markup against the data modules and catches dead links.
5. **Docs.** PRD, architecture (with Mermaid), technical notes, a 451-word feature
   overview, the diagram source, and these task files.

## Active decisions and considerations

- **Accessibility outranks brand purity.** BUX says not to use tints lighter than
  scarlet. Dark mode does anyway for link text, because the alternative is 2.7:1
  and illegible. Solid scarlet is preserved everywhere it can carry white text.
- **Non-text contrast (1.4.11) applies to controls, not decoration.** Card
  hairlines are exempt and stay subtle; button and chip borders use
  `--pf-border-strong` and are asserted at 3:1.
- **Token values live in two places on purpose** — the CSS renders them, the
  contrast module proves them. Change both together or the audit is fiction.

- **Home page at the repository root.** `/` is what a recruiter sees, so
  `index.html` lives at the root while its CSS stays at `pages/index/css/index.css`.
  This is a documented deviation from the sibling project's `pages/index/html/` layout.
- **No Tailwind CDN, unlike the sibling `PersonalWebsite` project.** A hiring page
  should not depend on a third-party script to render correctly.
- **Content in HTML, not rendered by JS.** Chosen for no-JS robustness and a fast
  hook. The duplication against `resume-data.js` is held in check by markup tests
  rather than by discipline.
- **Honest numbers only.** Every metric on the home page traces to a résumé bullet
  on the experience page. Skill depth is labelled daily driver / production /
  working knowledge instead of invented percentages.
- **Availability wording.** The YouTube role ended Jul 2026, so the site says
  "open to full-stack and front-end engineering roles" rather than implying a
  current position.
- **This site is separate from the Y2K creative site.** Different audience,
  different aesthetic, shared conventions only.

## Next steps

1. Generate `og-card.png` and add Open Graph / Twitter card image tags to all five pages.
2. Produce a `JT` favicon set in this palette to replace the borrowed icons.
3. Run Lighthouse on every page and record the scores in `docs/technical.md`.
4. Audit light-theme contrast with a checker, adjusting `--pf-text-subtle` if needed.
5. When content grows, extract the repeated header/footer block (P3) before adding a
   seventh page.
