# Design and Frontend Standard

The quality bar for every website I build, whatever the client or industry.
It describes **expectations**, not a look. Each project gets its own visual
identity; what carries over is the level of care.

Read this before starting any web project, together with that project's own
instructions (README, CLAUDE.md, brief).

---

## 1. Design philosophy

**What I want**

- Original, distinctive design with a recognisable personality.
- High-end presentation and a clear creative direction: one idea that the
  whole site expresses, chosen for this client.
- Typography as the main design material, not a default: chosen typefaces,
  a real hierarchy, deliberate line lengths, proportions and whitespace.
- Strong visual hierarchy: the eye always knows where to go next.
- Page compositions that differ from page to page and section to section,
  each with a clear purpose.
- Meaningful animation: motion that explains, guides or rewards, never
  decoration for its own sake.
- Refined micro-interactions: hover, focus, press and state changes that feel
  considered.
- Responsive layouts that are recomposed for each size, not shrunk.
- Clean, uncluttered layouts and attention to small details: alignment,
  spacing rhythm, optical balance, punctuation, image crops.

**What I do not want**

- Generic templates and predictable "AI website" aesthetics: centred hero +
  three feature cards + testimonial slider + CTA band, gradient blobs, glassy
  cards everywhere, emoji icons, stock phrases.
- The same image-and-text block repeated down the page.
- Motion that bounces, loops, delays content, or hijacks scrolling.
- Copying a previous project's look. A mountain hotel, a law firm and a
  bakery must not look like siblings.

**Adapt to each client**

Before designing, write down in a few lines: who the audience is, what the
brand should feel like, what the site must achieve, and the one creative idea
that ties it together. Derive palette, type, layout and motion from that, not
from the last project.

---

## 2. Content and honesty

- Copy should be natural, specific and warm. No inflated marketing phrases,
  no repeated filler.
- Never invent facts: prices, facilities, services, specifications, awards,
  reviews, history, locations, availability. If information is missing, use
  neutral wording or leave it out, and say what is missing.
- Never present placeholder or mock content as real. Unfinished states are
  visibly marked as unfinished.
- Concept or portfolio projects say so clearly on every page.

---

## 3. Frontend quality

Every project aims for production quality:

- **Architecture:** small reusable components, content separated from
  layout, one source of truth for copy and data.
- **Design system:** tokens for colour, type scale, spacing, radii, easing and
  durations. Components use tokens, not one-off values.
- **Responsive:** mobile, tablet, laptop, desktop and large screens each
  checked. No horizontal overflow. Touch targets at least 44 px.
- **Accessibility:** semantic HTML, keyboard support, visible focus, skip
  link, alt text, labelled controls, WCAG AA contrast (checked by
  calculation, not by eye), `prefers-reduced-motion` respected.
- **Performance:** responsive images in modern formats, lazy loading below
  the fold, fonts subset and preloaded, minimal JavaScript, no layout shift.
- **Animation technique:** CSS first (transitions, scroll-driven animations,
  view transitions), small vanilla JS with IntersectionObserver and
  `requestAnimationFrame` next, a library only when it earns its size. Animate
  `transform` and `opacity`, not layout.
- **Dependencies:** each new library justified by function, size,
  maintenance and whether native CSS/JS would do. Prefer none.
- **Functionality first:** no visual effect is worth a broken route, form,
  link or booking flow. Existing behaviour and data contracts are preserved.

---

## 4. Testing before "done"

Nothing is called tested unless it was run, with the output shown.

1. Type check, unit tests and production build pass.
2. Every route loads in a real browser with no console errors.
3. Every link and button goes somewhere real; every form validates and
   submits.
4. Phone, tablet, laptop and wide desktop: no overflow, nothing clipped,
   hierarchy intact.
5. Keyboard-only pass: skip link, menu, focus order, visible focus.
6. Reduced-motion pass: content visible and usable with motion off.
7. Images: none broken, sensible crops at every size.
8. Compare before and after: build output, page weight, test counts.

Before declaring it finished, review it as a demanding creative director, a
senior frontend engineer, the client, and a design award jury. If any of them
would call it generic, unfinished or broken, keep going.

---

## 5. How to work with me

I am learning web development as I go. Teach while delivering, but never let
teaching replace delivery.

- Explain the important decisions briefly and in plain language: what was
  chosen, why, and what the alternative would have cost.
- Point out techniques worth learning from the code (with the file and line),
  without long theory.
- Keep momentum: make sensible decisions autonomously and finish the work.
  Stop and ask only when a choice could destroy data or working
  functionality, or when the options would build genuinely different things.
- End with what was built, what was tested (with results), and what is left.

---

## 6. Starting a new project: checklist

1. Read this file and the project's own instructions.
2. Inspect the existing code, content, assets and constraints.
3. Write the brief: audience, brand feeling, goals, the one creative idea.
4. Choose palette, typography and motion language for this client.
5. Build the design system (tokens) before the pages.
6. Build pages with distinct compositions; preserve required functionality.
7. Test everything in section 4.
8. Review, polish, and report honestly.
