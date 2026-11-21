# Zmeuriș Mountain House: concept hotel website

**This is a concept project.** Zmeuriș Mountain House is a made-up hotel in the
Apuseni Mountains, Romania. The rooms, prices and menus are fiction, and nothing
can be booked. The mountains are real. Designed and built by Nedelcu Valentin as
a portfolio piece.

The booking web app for the same hotel is a separate concept:
`concept-booking-app`.

## Stack

- Astro (static pages), TypeScript, plain CSS with design tokens
- Fraunces and Instrument Sans, self-hosted (SIL Open Font License)
- Hosted on Cloudflare Workers static assets (`wrangler.jsonc`)

## Design

The house stands where the meadow meets the forest, and the site is built on
that edge: light cream "meadow" sections give way to forest green and pine as
you scroll. The quality bar for this and future projects is in
[DESIGN_STANDARD.md](DESIGN_STANDARD.md).

- Tokens: `src/styles/tokens.css` (palette with calculated WCAG contrast).
- Motion uses no library. Scroll reveals are in `src/scripts/reveal.ts`,
  parallax in `src/scripts/parallax.ts`, and the header and phone menu in
  `src/scripts/header.ts`. Scroll-driven CSS animations and cross-page view
  transitions apply only where the browser supports them.
- Every effect respects `prefers-reduced-motion`, and all content shows
  without JavaScript.
- Headings in `src/content/hotel.ts` mark one italic phrase with
  `*asterisks*`; `src/components/Split.astro` sets them word by word.

## Run it

Run these in PowerShell on Windows (a lowercase `d:\` path from Git Bash makes
Astro drop the stylesheets; the build checks for this).

```
npm install
npm run dev       development server, port 4321
npm run check     type check
npm test          content rules
npm run build     production build into dist/, then page checks
npm run deploy    build and deploy to Cloudflare (needs `npx wrangler login` once)
```

## Photos

Every photo is listed in `src/content/photos.ts` as a slot. A slot is ready when
`src/assets/photos/<slot>.jpg` exists and the slot has alt text. A credit is
optional; when given, it is listed on the photos page.

- `npm run dev` shows a labelled "photo pending" box for slots that are not ready.
- `npm run build` stops with a message naming the first slot that is not ready.

Photos are free-licence stock photos from Unsplash or Pexels. They show other
places, not this hotel; the photos page and the area page say so.

## Content rules

All copy is in `src/content/hotel.ts`. The tests in `test/` enforce:

- room counts add up to the stated number of rooms;
- every photo used has a slot, and any credit points at Unsplash or Pexels;
- the concept notice says plainly that the hotel is not real;
- no reviews, ratings, awards or star classifications, which would be fake.

The build check (`scripts/check-build.mjs`) fails if any page lacks its
stylesheet or the concept notice.
