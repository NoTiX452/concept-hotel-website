// Field errors: a message under each field (linked with aria-describedby in
// the markup), aria-invalid on the control, and a summary at the top of the
// form that takes focus, so a screen reader reads the list at once.
import type { FieldErrors } from "./api";
import { h } from "./dom";

export function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  form.querySelectorAll<HTMLElement>("[data-error-for]").forEach((el) => (el.textContent = ""));
  const summary = form.querySelector<HTMLElement>("[data-error-summary]");
  if (summary) summary.hidden = true;
}

export function showErrors(form: HTMLFormElement, fields: FieldErrors, intro = "Check these fields:"): void {
  clearErrors(form);
  const summary = form.querySelector<HTMLElement>("[data-error-summary]");
  const items: HTMLLIElement[] = [];
  for (const [name, message] of Object.entries(fields)) {
    const control = form.querySelector<HTMLElement>(`[name="${CSS.escape(name)}"]`);
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${CSS.escape(name)}"]`);
    if (control) control.setAttribute("aria-invalid", "true");
    if (slot) slot.textContent = message;
    const link = control?.id ? h("a", { href: `#${control.id}` }, message) : message;
    if (link instanceof HTMLAnchorElement) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        control?.focus();
      });
    }
    items.push(h("li", {}, link));
  }
  if (!summary) return;
  summary.replaceChildren(h("p", { class: "summary-title" }, intro), h("ul", {}, ...items));
  summary.hidden = false;
  summary.focus();
}

// Marks a submit button busy without disabling it, so focus is not lost.
export function setBusy(button: HTMLButtonElement, busy: boolean, busyText: string): void {
  const label = button.querySelector<HTMLElement>("[data-label]") ?? button;
  if (busy) {
    button.dataset.idleText = label.textContent ?? "";
    label.textContent = busyText;
    button.setAttribute("aria-disabled", "true");
  } else {
    label.textContent = button.dataset.idleText ?? label.textContent;
    button.removeAttribute("aria-disabled");
  }
}

export const isBusy = (button: HTMLButtonElement) => button.getAttribute("aria-disabled") === "true";

// A message in a role="status" area, read out when it changes.
export function say(area: HTMLElement, message: string, tone: "info" | "error" = "info"): void {
  area.dataset.tone = tone;
  area.textContent = message;
}
