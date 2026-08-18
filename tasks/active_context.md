# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-18_

## Mode

**ACT / Code MODE** — OSU logo legible in light mode.

## Current work focus

When a recruiter toggles to light mode, the Education pill must show
`osu_vertical_light.svg` instead of the white-on-dark `osu_vertical_dark.svg`.
Do **not** lock an aspect-ratio; the two files already share a viewBox.

## Recent changes — OSU logo theme pair

- Education brand includes both SVGs with `.pf-theme-logo--dark` /
  `.pf-theme-logo--light`. Existing `layout.css` `[data-theme]` rules pick one.
- No new sizing CSS. Markup tests require both assets, matching viewBoxes,
  and no `aspect-ratio` in `about.css`.

## Active decisions

- Theme-paired logos stay CSS-only (`data-theme` already set by the toggle).
- OSU sizing stays on `.about-education__brand img` (`object-fit: contain`,
  `max-width: 13rem`). Do not copy the YouTube aspect-ratio lock.

## Next steps

1. Toggle About to light mode and confirm the Block O + wordmark stay readable
   at the same size as dark mode.
2. Optional git commit if requested.
3. P1 backlog: OG image, favicons, Lighthouse, focus-ring on scarlet.
