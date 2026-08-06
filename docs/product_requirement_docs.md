# Product Requirement Document — Jamie Tucker Portfolio

## 1. Why this project exists

Jamie Tucker's professional story currently lives in a one-page PDF résumé. A PDF
cannot demonstrate front-end craft, cannot be linked from a LinkedIn message, and
gives a recruiter no way to check a claim without emailing back. This project is a
recruiter-facing portfolio site whose primary job is to convert a 20-second skim
into an interview conversation.

It is deliberately separate from the sibling `PersonalWebsite` project (a Y2K-styled
creative site for music, reels, and photos). That site is about hobbies. **This site
is about hiring.** They share conventions, not content or aesthetics.

## 2. Audience

| Audience | What they need in the first 20 seconds |
| --- | --- |
| Technical recruiter | Title, location, availability, stack, résumé download |
| Hiring manager | Scope of ownership, measurable outcomes, career trajectory |
| Non-tech viewer / screener | Clear story without jargon walls or endless scroll |
| Interviewing engineer | Architecture decisions, trade-offs, how the code is written |

The site is optimised for the recruiter and non-tech skim first, because those
readers decide whether anyone else ever sees it.

## 3. Problems it solves

1. **No proof of craft.** The site itself is a work sample: hand-written HTML, CSS,
   and JavaScript with unit-tested logic and no build step.
2. **Unverifiable claims.** Every skill links to the role where it was used; every
   headline number traces back to a résumé bullet.
3. **Dead ends.** A reader who lands on the page can always reach the résumé PDF,
   LinkedIn, or email without using the browser back button.
4. **Too much vertical scroll (Milestone 6).** The current seven-section page is too
   long for a recruiter skim. Content must consolidate into three major sections
   without losing the important hiring signal.

## 4. Core requirements

### Functional (as of Milestone 6 — Recruiter Concise Consolidation)

- **FR-1** Single-page static architecture at `/` (`index.html`). Three major
  sections in this order: **About**, **Experience**, **Contact**. Nav jumps between
  them by fragment.
- **FR-2 About** opens with the professional headshot (`/media/images/pro_headshot.jpeg`),
  a concise "How I Got Here" story that keeps the important details, a Download
  Résumé CTA, and a Matt Farley–style skill/role triad replacing the old "Four Things"
  card grid. The "Engineer first" intro block is removed.
- **FR-3 Experience** presents three YouTube-style **pill boxes** (one per role):
  YouTube Playables Game Creation, Google Search Intelligence, and Google Modern
  Creators and Formats. Each pill describes problem → approach → outcome. Skills are
  listed by category in a compact scannable form with far fewer words. "Away from the
  Keyboard" stays; its Download Résumé and "See the work history" buttons are removed.
- **FR-4 Contact** is two pill boxes only: LinkedIn (fastest) and Email. The résumé
  channel is removed here because it already appears in About.
- **FR-5** Responsive for desktop, tablet, and phone — each viewport is intentionally
  composed, not merely squeezed.
- **FR-6** Visual language borrows late-2000s / early-2010s YouTube UI cues (pill
  buttons, card chrome, masthead feel) while staying modern and sleek. **Colour
  scheme stays Ohio State scarlet / gray / white** — no palette rewrite.
- **FR-7** Content never overstates the résumé. Honest depth labels remain where skills
  are shown.
- **FR-8** Works without JavaScript for content; JS only enhances (theme, menu,
  reveal, copy-to-clipboard, optional filter behaviour if retained in a reduced form).

### Non-functional

- **NFR-1** Zero runtime dependencies. No frameworks, no CDN CSS, no build step.
- **NFR-2** Accessible: landmarks, skip link, visible focus, keyboard-operable
  controls, `prefers-reduced-motion` and `prefers-color-scheme`, AA contrast.
- **NFR-3** Tested: pure helpers have unit tests; markup is verified against data
  modules and for broken links. New Milestone 6 logic gets at least one unit suite.
- **NFR-4** Maintainable by one person: résumé content lives in `utils/resume-data.js`
  (and related modules); tests fail when HTML drifts.
- **NFR-5** Documentation: Memory Files updated; feature overview ≤500 words in
  `docs/`; Mermaid diagram in `diagrams/`; `tasks/changelog.md` kept current.
- **NFR-6** Agile: follow `.cursor/rules` and `specific_rule_files`. Prefer parallel
  commits over nested/child commits.

## 5. Out of scope (for now)

- Blog, analytics, contact form backend, i18n, hosting-specific config.
- Changing the scarlet / gray / white brand palette.
- Re-introducing the full eight-case-study work grid or separate Proof / Approach /
  Skills / Work nav destinations as first-class major sections.

## 6. Success criteria

- A recruiter can finish the page with noticeably less vertical scrolling than the
  seven-section layout, while still finding title, story, three roles, skills skim,
  LinkedIn, email, and the résumé.
- Desktop / tablet / phone each look intentional.
- `npm test` passes and fails loudly if content, links, or nav markup drift.
- Feature overview, diagram, Memory Files, and changelog all describe Milestone 6.

## 7. Design references (inspiration only)

- Single-page concise portfolios: [Brittany Chiang](https://brittanychiang.com/#about),
  [Matt Farley](https://mattfarley.ca/), [Lars Olson](https://www.lars-olson.com/)
- Early-2014 YouTube UI cues (pill chrome, masthead, card shadow):
  [Early 2014 YouTube for Rehike](https://userstyles.world/style/9427/early-2014-youtube-for-rehike)

## 8. Restated objective (Milestone 6)

Consolidate `index.html` into three concise major sections (About → Experience →
Contact) so recruiters and non-tech viewers understand the story faster, with less
scroll, YouTube-inspired pill boxes for roles and contact, the professional headshot
in About, compact skills, and early-2010s YouTube styling cues — without changing the
Ohio State colour scheme.
