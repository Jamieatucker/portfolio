# Home Timeline and Card Grid Parity

## What it does

Three related changes to how the site presents proof.

1. **The home page now holds the full work history.** The old "Career path" list
   (dates and job titles only) was replaced by the complete timeline that used to
   live on the Experience page: every résumé bullet, every technology tag, and the
   technology filter, under the `#experience` anchor. The standalone Experience
   page is gone; the Skills page deep-links to `/index.html?tech=React` instead,
   and the filter scrolls the timeline into view on arrival.
2. **Card grids never strand a lone card.** `pf-grid--2`, `--3`, and `--4` pin a
   fixed column count instead of using `auto-fit`, so the browser can no longer
   pick a count that leaves one card alone on the last row. When a grid genuinely
   holds an odd number of cards (the Contact page has three), the trailing card
   spans the full row so it reads as intentional.
3. **LinkedIn is the fastest contact channel.** It is the first card and carries
   the "fastest" label; email moved to second with a secondary button. The
   Location card was removed and the location moved into the "What I'm looking
   for" panel so nothing was lost.

## How it was implemented

```mermaid
flowchart LR
    SK["skills.html<br/>?tech=React"] --> IDX["index.html #experience"]
    IDX --> JS["pages/index/js/index.js"]
    JS --> F["utils/experience-filter.js"]
    F --> IDX
    L["layout.css<br/>pf-grid--2 fixed columns<br/>+ odd last child spans 1 / -1"] --> IDX
    L --> AB[about.html]
    L --> CT["contact.html<br/>LinkedIn first"]
    L --> PR["projects.html"]
    PJS["projects.js marks .is-last-visible"] --> L
    T["test/page-markup.test.js"] --> IDX
    T --> L
```

- `pages/experience/` was deleted. Its script became `pages/index/js/index.js`
  (unchanged logic) and its CSS moved into `pages/index/css/index.css`. The
  `exp-*` class names were kept so the markup, CSS, and JS still read as one
  block.
- `utils/site-nav.js` lost its `experience` entry, which automatically shrinks the
  header nav, footer sitemap, and prev/next tour to five pages.
- The grid rules live in `pages/shared/css/layout.css`. Because `:last-child`
  counts hidden cards, the projects filter adds `.is-last-visible` to the real
  trailing card when an odd number matches.

## How to edit it

- **Add or change a role:** edit the `<li class="exp-role">` block in
  `index.html`. Keep `data-role-tags` in sync with the `pf-tag` list — the filter
  reads the attribute, and `test/page-markup.test.js` compares both against
  `utils/resume-data.js`.
- **Add a technology chip:** add the tag to `data-role-tags`; chips are built from
  the DOM at load.
- **Add a card to a grid:** nothing to configure. An even count fills both
  columns; an odd count spans the last card.
- **Add a contact channel:** copy an existing `<article class="pf-card">` in
  `pages/contact/html/contact.html`. Only one card may carry the "fastest" label.

Run `npm test` after any edit; the markup suite fails on drift.
