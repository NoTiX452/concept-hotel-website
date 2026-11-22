// Reveals [data-reveal] elements as they scroll into view by adding
// .is-visible. The CSS in global.css decides what each variant looks like
// (up, fade, mask, words). Without JavaScript, or with reduced motion,
// everything is visible from the start.
//
// Photos inside a reveal are hidden (clipped or transparent) until it runs,
// so the browser's lazy loading would not fetch them until the reveal had
// started, and the frame would open onto an empty box. Two fixes:
// 1. a wide "preload" observer starts their download about a screen early;
// 2. a reveal waits (briefly) for its photo, so the frame opens onto it.
const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

// How long a reveal may wait for its photo before opening anyway.
const MAX_WAIT_MS = 900;

const lazyImages = (el: Element) => Array.from(el.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));

const whenLoaded = (el: Element) => {
  const pending = Array.from(el.querySelectorAll("img")).filter((img) => !img.complete);
  if (pending.length === 0) return Promise.resolve();
  // A photo that fails to load must not hold its reveal back, so errors count as done.
  const loads = pending.map(
    (img) =>
      new Promise<void>((done) => {
        img.addEventListener("load", () => done(), { once: true });
        img.addEventListener("error", () => done(), { once: true });
      }),
  );
  return Promise.race([Promise.all(loads), new Promise((done) => setTimeout(done, MAX_WAIT_MS))]);
};

if ("IntersectionObserver" in window) {
  const preload = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        lazyImages(entry.target).forEach((img) => (img.loading = "eager"));
        preload.unobserve(entry.target);
      }
    },
    // About one screen ahead of the reader, in either direction.
    { rootMargin: "100% 0px 100% 0px" },
  );

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const target = entry.target;
        lazyImages(target).forEach((img) => (img.loading = "eager"));
        whenLoaded(target).then(() => target.classList.add("is-visible"));
      }
    },
    // Start slightly before the element is fully in view.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );

  items.forEach((item) => {
    if (item.querySelector("img")) preload.observe(item);
    observer.observe(item);
  });
} else {
  items.forEach((item) => item.classList.add("is-visible"));
}

// A module: its names stay private to this file.
export {};
