# Tasks Plan — Jamie Tucker Portfolio

## Current status

**Milestones 1–6 are complete and tested.** The site is a three-section static
portfolio (About → Experience → Contact) in the Ohio State palette, with
YouTube-inspired pill boxes, soft hash aliases, and unit-tested shared logic.
`npm test` runs nine suites, all passing.

### Milestone 6 — recruiter concise consolidation (done)
- [x] Merge hero into About; pro headshot; résumé CTA; concise How I Got Here
- [x] Farley triad with What I do titles; proof metrics as bullets
- [x] Compact education block; remove Engineer first
- [x] Three role pill boxes (P/A/O); compact skills; interests without CTAs
- [x] Contact LinkedIn + Email only
- [x] Remove technology filters
- [x] Soft-alias retired hashes
- [x] YouTube-era structural styling; colour scheme unchanged
- [x] `role-pills.js` + unit tests; markup / site-nav updates
- [x] Feature doc ≤500 words; Mermaid diagram; Memory Files + changelog

### Milestones 1–5 (done)
See earlier changelog entries: foundation, OSU theme, home timeline, length
controls, seven-section single-page architecture (superseded by M6 layout).

## What works

- Three-section `index.html` with responsive About / Experience / Contact
- `utils/role-pills.js`, `site-nav` aliases, `APPROACH_TRIAD`, pro headshot path
- `.pf-pill-box` chrome; denser masthead; soft card shadow
- Nine Node suites via `test/run-all.js`
- Docs: Memory Files + `docs/recruiter-concise-consolidation.md`

## Recent — OSU logo theme pair (2026-08-18)

- [x] Education pill ships `osu_vertical_dark.svg` + `osu_vertical_light.svg`
- [x] Reuses `.pf-theme-logo--*` (no aspect-ratio; files already share a viewBox)
- [x] Markup test covers both assets, matching viewBox, and forbids aspect-ratio in about.css

## Recent — YouTube light-theme size match (2026-08-18)

- [x] Black YouTube SVG rebuilt from the white mark (same viewBox; fill `#282828`)
- [x] Theme pair shares one grid cell and `aspect-ratio: 660.27 / 170.0805`
- [x] Both visible states use `display: block` so the box model matches
- [x] Markup test asserts matching viewBox + aspect-ratio lock

## Recent — YouTube logo theme pair (2026-08-18)

- [x] Playables pill ships white + black YouTube SVGs (`pf-theme-logo--dark/light`)
- [x] `[data-theme='light']` hides the white mark and shows the black mark
- [x] Black SVG viewBox cropped to the wordmark so it sizes like the white mark
- [x] Markup test covers both assets and the layout.css show/hide rules

## Recent — education pill layout (2026-08-18)

- [x] Education grid is one row (`degree | list | brand`); no empty cell above affiliations
- [x] OSU logo contained like role-pill logos (`object-fit: contain`, `max-width: 13rem`)
- [x] Affiliations heading for recruiter scan (NSBE, Lambda Psi, Morrill Scholars)
- [x] Markup test forbids `'brand .'` and checks logo sizing + label

## Recent — skip-link centering (2026-08-18)

- [x] `.pf-skip-link` centered on the nav bar (`left: 50%`, header midline)
- [x] Focus transform keeps horizontal + vertical centering; hide offset unchanged
- [x] Markup test covers centered skip-link CSS; design tokens untouched

## What's left (backlog)

### P1 — before sharing widely
- [ ] Open Graph image + meta tags
- [ ] Real JT favicon set
- [ ] Lighthouse pass recorded in `docs/technical.md`
- [ ] Focus-ring contrast on scarlet surfaces

### P2 — content depth
- [ ] Optional in-place expansion for a role pill
- [ ] Testimonials (needs permission)

### P3 — engineering polish
- [ ] HTML validator + link checker in `npm test`
- [ ] Headless smoke test for DOM wiring / hash aliases

## Known issues and risks

| Issue | Impact | Mitigation |
| --- | --- | --- |
| Unused `work.js` / `skills.css` still on disk | Mild clutter | Safe to delete later; not loaded |
| `experience-filter.js` unused on page | Dead code path at runtime | Kept + tested for possible future use |
| Soft aliases need JS | No-JS visitors keep old hash without scroll | Content still on one page; rare |
| Pill copy vs full résumé bullets | Less interview depth on-page | PDF + data modules retain full detail |
