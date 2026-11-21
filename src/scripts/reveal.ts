// Reveals [data-reveal] elements as they scroll into view by adding
// .is-visible. The CSS in global.css decides what each variant looks like
// (up, fade, mask, words). Without JavaScript, or with reduced motion,
// everything is visible from the start.
const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    // Start slightly before the element is fully in view.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("is-visible"));
}

// A module: its names stay private to this file.
export {};
