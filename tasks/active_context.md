# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-18_

## Mode

**ACT / Code MODE** — align `pf-shell` gutters with `about-hero`.

## Current work focus

On narrow viewports, My Story / Education / Experience / Contact sat on the
left edge because `.pf-section { padding: space-8 0 0 }` overrode
`.pf-shell` horizontal padding. `about-hero` only sets padding-top/bottom
longhands, so it kept the gutter.

## Recent changes — shell gutter alignment

- `.pf-section` is `padding-top` only.
- Markup test requires that longhand and forbids the old shorthand.

## Active decisions

- Horizontal inset lives on `.pf-shell` only. Section rhythm is vertical.
- Theme-paired logos stay CSS-only.

## Next steps

1. Shrink the viewport and confirm every section’s left edge matches the hero.
2. Optional git commit if requested.
3. P1 backlog: OG image, favicons, Lighthouse, focus-ring on scarlet.
