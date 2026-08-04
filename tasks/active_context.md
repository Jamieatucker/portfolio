# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-04_

## Current work focus

Milestone 1 is done: the multi-page architecture for the professional portfolio is
built, tested, and documented. The project moved from an empty scaffold (empty
`pages/index`, `pages/about`, `docs`, `tasks`, `test`, `utils`, `diagrams`) to a
complete six-page site in this session.

Nothing is in flight. The next work item is the P1 backlog in
[`tasks_plan.md`](tasks_plan.md), starting with the Open Graph image and a proper
favicon set, both of which matter the moment the link is shared on LinkedIn.

## Recent changes

1. **Data layer.** Five UMD modules in `utils/` hold the résumé, the case studies,
   the nav model, the filter logic, and theme resolution.
2. **Shared chrome.** `theme.css` (tokens, dark + light, universal font stack) and
   `layout.css` (header, cards, footer, tour) plus `theme-init.js` and `site.js`.
3. **Six pages.** Root `index.html` as the home page, and `about`, `experience`,
   `projects`, `skills`, `contact` under `pages/<name>/html/`.
4. **Six test suites.** Five unit suites plus `page-markup.test.js`, which verifies
   the hand-written markup against the data modules and catches dead links.
5. **Docs.** PRD, architecture (with Mermaid), technical notes, a 451-word feature
   overview, the diagram source, and these task files.

## Active decisions and considerations

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

1. Generate `og-card.png` and add Open Graph / Twitter card image tags to all six pages.
2. Produce a `JT` favicon set in this palette to replace the borrowed icons.
3. Run Lighthouse on every page and record the scores in `docs/technical.md`.
4. Audit light-theme contrast with a checker, adjusting `--pf-text-subtle` if needed.
5. When content grows, extract the repeated header/footer block (P3) before adding a
   seventh page.
