# Zmeuriș Mountain House: concept hotel website

**This is a concept project.** Zmeuriș Mountain House is a made-up hotel in the
Apuseni Mountains, Romania. The rooms, prices and menus are fiction, and a stay
requested here is never a real booking. The mountains are real. Designed and
built by Nedelcu Valentin as a portfolio piece.

**Live demo:** https://concept-hotel.concept-hotel-website.workers.dev

## Requesting a stay

Guests request a stay on [`/book/`](https://concept-hotel.concept-hotel-website.workers.dev/book/):
dates, then a room (with what is free and the sample price for the stay), then
their details. Each room page links there with that room chosen
(`/book/?room=meadow|forest|loft|family`).

The request goes to the hotel's reception in a separate concept, the
[booking app](https://github.com/NoTiX452/concept-booking-app), where it
arrives as pending. The page calls this site's own `/api/*`; the Worker in
`worker/index.ts` passes the three guest calls to the app over a Cloudflare
service binding, so the browser never talks to another site and the app's
staff API cannot be reached from here. Nothing is charged, no email is sent,
and the app deletes every request at its nightly reset. The page asks for a
made-up name and email, because the demo reception has a public login.

## Stack

- Astro (static pages), TypeScript, plain CSS with design tokens
- Fraunces and Instrument Sans, self-hosted (SIL Open Font License)
- Cloudflare Workers: static assets, plus a small Worker for `/api/*`
  (`wrangler.jsonc`)

## Design

The house stands where the meadow meets the forest, and the site is built on
that edge: light cream "meadow" sections give way to forest green and pine as
you scroll.

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
npm run dev         development server, port 4321 (pages only, no /api/)
npm run dev:worker  build, then run the site with its Worker on port 8788
npm run check       Astro and Worker type checks
npm test            content rules and the Worker
npm run build       production build into dist/, then page checks
npm run deploy      build and deploy to Cloudflare (needs `npx wrangler login` once)
```

To try `/book/` locally, run the booking app in a second terminal first
(`npm run dev:worker` in `concept-booking-app`). `wrangler dev` connects the
two by the app's Worker name and prints `env.BOOKING (concept-booking) …
[connected]`. In production the booking app must be deployed on the same
Cloudflare account.

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
- each room is one room type in the booking app, and the request page says
  the stay is not real and asks for made-up details;
- no reviews, ratings, awards or star classifications, which would be fake.

The build check (`scripts/check-build.mjs`) fails if any page lacks its
stylesheet or the concept notice.
