# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-18_

## Mode

**ACT / Code MODE** — skip-link position on the nav bar.

## Current work focus

Center the “Skip to content” control on the sticky header for keyboard /
screen-reader users. Visual design of `.pf-skip-link` is unchanged.

## Recent changes — skip-link centering

- `.pf-skip-link` in `layout.css` is centered on the header (`left: 50%`,
  `--pf-header-h` midline, `translate(-50%, -50%)` on focus). Tokens unchanged.
- `page-markup.test.js` asserts that centering contract.

## Recent changes — Milestone 6

1. **`index.html`** rebuilt as About → Experience → Contact; hero merged into About.
2. **`pro_headshot.jpeg`** wired; `profile.jpeg` removed from live markup.
3. **Farley triad** uses “What I do” titles; proof metrics are triad bullets.
4. **Three role pill boxes** (P/A/O) from `utils/role-pills.js`.
5. **Compact skills**; filters and filter scripts removed.
6. **Contact** LinkedIn + Email only; résumé stays in About / footer.
7. **`HASH_ALIASES` + `setupHashAliases`** for `#work`, `#skills`, `#proof`, etc.
8. **CSS** `.pf-pill-box`, `--pf-card-shadow`, denser masthead; colours locked.
9. **Tests** `role-pills.test.js` + updated site-nav / page-markup; all green.
10. **Docs** `docs/recruiter-concise-consolidation.md`,
    `diagrams/recruiter-concise-consolidation.mmd`, Memory Files updated.

## Active decisions

- Skip link stays first in the DOM; only CSS position is centered on the header.
- Scroll reduction over exhaustive case-study grids.
- Soft aliases over breaking old fragments.
- Pill borders use `--pf-border-strong` (S2 / WCAG 1.4.11).
- `role-pills.js` is the tested pill model (S1).

## Next steps

1. Tab to the skip link and confirm it appears centered on the header, then
   activates `#main`.
2. Optional git commit if requested.
3. P1 backlog: OG image, favicons, Lighthouse, focus-ring on scarlet.
