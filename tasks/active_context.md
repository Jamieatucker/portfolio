# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-18_

## Mode

**ACT / Code MODE** — YouTube light-theme logo size match.

## Current work focus

The light-theme YouTube wordmark must occupy the same dimensions as the dark
mark. A different SVG artwork (wider aspect) was shrinking it on toggle.

## Recent changes — YouTube light-theme size match

- `youtube_logo_black.svg` is now the white mark with wordmark fill `#282828`
  and the same `viewBox` / width / height.
- `.pf-theme-logo` shares `grid-area: 1 / 1` and
  `aspect-ratio: 660.27 / 170.0805`. Visible states both use `display: block`.
- Markup test asserts matching viewBoxes.

## Recent changes — YouTube logo theme pair

- Playables pill includes white + black YouTube SVGs; `[data-theme]` picks one.

## Active decisions

- Do not invert the white SVG (play button would go off-brand). Recolor the
  wordmark paths instead, keeping geometry identical.
- Theme-paired logos stay CSS-only.

## Next steps

1. Toggle Experience light/dark and confirm the YouTube logo does not jump in
   size.
2. Optional git commit if requested.
3. P1 backlog: OG image, favicons, Lighthouse, focus-ring on scarlet.
