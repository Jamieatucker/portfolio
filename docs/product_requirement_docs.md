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
| Interviewing engineer | Architecture decisions, trade-offs, how the code is written |

The site is optimised for the recruiter skim first, because that reader decides
whether the other two ever see it.

## 3. Problems it solves

1. **No proof of craft.** The site itself is a work sample: hand-written HTML, CSS,
   and JavaScript with unit-tested logic and no build step.
2. **Unverifiable claims.** Every skill links to the role where it was used; every
   headline number traces back to a résumé bullet in the home page timeline.
3. **Dead ends.** A reader who lands on any page can always reach the next one,
   the résumé PDF, or the email address without using the browser back button.

## 4. Core requirements

### Functional

- **FR-1** Multi-page static architecture: Home (including the work-history
  timeline at `#experience`), About, Projects,
  Skills, Contact. Each page owns its own CSS (and JS where it has behaviour).
- **FR-2** The home page must open with a hook: a one-line claim, a proof strip of
  hard numbers, an availability status, and both primary calls to action
  (see impact / download résumé) above the fold on a laptop.
- **FR-3** Content is drawn from the attached résumé and must never overstate it.
- **FR-4** The home page timeline presents roles newest-first with the outcome of each
  bullet, filterable by technology, deep-linkable via `?tech=`.
- **FR-5** Projects page presents each piece of work as problem → approach → outcome.
- **FR-6** Skills page labels depth honestly (daily driver / production / working
  knowledge) and links each technology to its evidence.
- **FR-7** Contact page offers email (with copy-to-clipboard), LinkedIn, résumé
  download, and location. No contact form — there is no backend to receive it.
- **FR-8** Every page renders the full navigation, marks the current page, and
  offers a previous/next tour link.

### Non-functional

- **NFR-1 Typography:** a universal English font stack that is legible for any
  viewer. Inter is a progressive enhancement over the system UI fonts; the site
  must look correct if the web font never loads.
- **NFR-2 Zero runtime dependencies.** No frameworks, no CDN CSS, no build step.
  The site must work when opened from a plain static host.
- **NFR-3 Works without JavaScript.** All content is in the HTML. JavaScript adds
  filtering, theming, the tour, and reveal animation — never content.
- **NFR-4 Accessible:** landmarks, skip link, visible focus, keyboard-operable
  controls, `prefers-reduced-motion` and `prefers-color-scheme` respected,
  AA-level contrast in both themes.
- **NFR-5 Tested:** every pure helper has unit tests covering its edge cases, and
  the static markup is verified against the data modules and for broken links.
- **NFR-6 Maintainable by one person:** résumé content lives in exactly one place
  (`utils/resume-data.js`) and tests fail when the HTML drifts from it.

## 5. Out of scope (for now)

- Blog or writing section, analytics, contact form backend, i18n, dark/light
  artwork variants, and any hosting-specific configuration.

## 6. Success criteria

- A recruiter can find title, location, stack, availability, and the résumé within
  one screen of the home page.
- `npm test` passes and fails loudly if content, links, or nav markup drift.
- Every page scores well on Lighthouse accessibility and needs no network beyond
  the optional web font.
