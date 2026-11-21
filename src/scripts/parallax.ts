// Subtle parallax: an element with data-parallax="0.12" moves at 12% of its
// distance from the centre of the screen. Only transform changes, and only
// for elements on screen, once per animation frame. Off with reduced motion.
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

if (targets.length > 0 && !reduced.matches && "IntersectionObserver" in window) {
  const active = new Set<HTMLElement>();
  let frame = 0;

  const update = () => {
    frame = 0;
    const mid = window.innerHeight / 2;
    for (const el of active) {
      const speed = Number(el.dataset.parallax) || 0.1;
      // Measure the parent: it does not move, so the maths stays stable.
      const box = (el.parentElement ?? el).getBoundingClientRect();
      const offset = box.top + box.height / 2 - mid;
      // Never drift further than the photo's bleed (12% of the frame, see
      // Photo.astro), or an edge of the frame would show.
      const limit = box.height * 0.11;
      const y = Math.max(-limit, Math.min(limit, -offset * speed));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) active.add(el);
        else active.delete(el);
      }
      schedule();
    },
    { rootMargin: "20% 0px" },
  );

  // The generous rootMargin covers the few pixels a target moves.
  for (const el of targets) observer.observe(el);

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();
}

// A module: its names stay private to this file.
export {};
