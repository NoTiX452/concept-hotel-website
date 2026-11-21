// Header behaviour:
// - data-scrolled: once the page moves, the bar gets its own background.
// - data-hidden: scrolling down hides the bar, scrolling up brings it back.
// - the phone menu is a <dialog>, so focus trapping, Escape and the inert
//   page behind it come from the browser.
const header = document.querySelector<HTMLElement>(".site-header");
const menu = document.querySelector<HTMLDialogElement>("#site-menu");
const openButton = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

if (header) {
  let lastY = window.scrollY;
  let frame = 0;

  const update = () => {
    frame = 0;
    const y = window.scrollY;
    header.toggleAttribute("data-scrolled", y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    const keep = header.contains(document.activeElement) || menu?.open;
    if (goingDown && y > 520 && !keep) header.setAttribute("data-hidden", "");
    else if (goingUp || y <= 520) header.removeAttribute("data-hidden");
    if (goingDown || goingUp) lastY = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  // Keyboard users tabbing into a hidden header get it back.
  header.addEventListener("focusin", () => header.removeAttribute("data-hidden"));
  update();
}

if (menu && openButton) {
  const close = () => {
    if (!menu.open) return;
    if (reduced.matches) {
      menu.close();
      return;
    }
    menu.setAttribute("data-closing", "");
    window.setTimeout(() => {
      menu.removeAttribute("data-closing");
      menu.close();
    }, 380);
  };

  openButton.addEventListener("click", () => {
    menu.showModal();
    openButton.setAttribute("aria-expanded", "true");
  });

  menu.addEventListener("close", () => {
    openButton.setAttribute("aria-expanded", "false");
    openButton.focus();
  });

  // Escape: play the closing animation instead of closing at once.
  menu.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  menu.querySelectorAll("[data-menu-close]").forEach((el) => el.addEventListener("click", close));

  // Close if the screen grows past the phone layout while the menu is open.
  window.matchMedia("(min-width: 60rem)").addEventListener("change", (event) => {
    if (event.matches && menu.open) menu.close();
  });
}

// A module: its names stay private to this file.
export {};
