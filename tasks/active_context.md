# Active Context — Jamie Tucker Portfolio

_Last updated: 2026-08-18_

## Mode

**ACT / Code MODE** — document-relative asset paths for GitHub Pages.

## Current work focus

Root-absolute `href`/`src` (`/pages/…`, `/media/…`, `/utils/…`) 404 when GitHub
Pages serves the site under `https://jamieatucker.github.io/<repo>/`. Convert
every local asset path to `./…` from `index.html` so Pages matches local
`npm start`.

## Recent changes — document-relative paths

- `index.html` CSS, JS, favicons, images, résumé, canonical, JSON-LD image use `./`
- `PROFILE.resumePath` / `photoPath` match the markup
- Markup tests forbid root-absolute local refs and require `./` prefix

## Active decisions

- Document-relative from `index.html`; hashes (`#about`) and `https://` URLs stay
- `LEGACY_PATHS` remain historical URL pathnames, not asset loads
- Horizontal inset lives on `.pf-shell` only. Section rhythm is vertical.
- Theme-paired logos stay CSS-only.

## Next steps

1. Preview with `npm start` and confirm CSS, logos, headshot, and résumé load.
2. Push to GitHub account `Jamieatucker` and enable Pages from `main` / `/ (root)`.
3. P1 backlog: OG image, favicons, Lighthouse, focus-ring on scarlet.
