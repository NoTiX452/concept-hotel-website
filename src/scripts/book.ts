// The /book/ page: find free rooms for the dates, choose one, send the request.
// The rooms are in the page (with their photos); this script fills in what is
// free and the price for the stay, from the booking app's answer.
import { api } from "./booking/api";
import { $, h } from "./booking/dom";
import { clearErrors, isBusy, say, setBusy, showErrors } from "./booking/forms";
import { addDays, formatDate, formatLei, hotelToday, nightsBetween, plural } from "./booking/format";

type RoomOption = {
  roomType: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  available: number;
  fitsGuests: boolean;
};

type Created = {
  reference: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: string;
};

const page = $("[data-reception]");
const receptionUrl = page.dataset.reception!;
const search = $<HTMLFormElement>("[data-search]");
const bookForm = $<HTMLFormElement>("[data-book]");
const done = $("[data-done]");
const status = $("[data-book-status]");
const roomNote = $("[data-room-note]");
const requestLine = $("[data-request-summary]");
const checkIn = $<HTMLInputElement>("#checkIn");
const checkOut = $<HTMLInputElement>("#checkOut");
const guests = $<HTMLSelectElement>("#guests");
const radios = [...bookForm.querySelectorAll<HTMLInputElement>("input[name=roomType]")];
const roomName = (type: string) => bookForm.querySelector(`label[for="room-${CSS.escape(type)}"]`)?.textContent ?? type;

// Start from the address (room pages link here with ?room=), or a sensible
// default: two nights, a week from today.
const params = new URLSearchParams(location.search);
const today = hotelToday();
const isDate = (v: string | null): v is string => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
checkIn.min = today;
checkOut.min = addDays(today, 1);
checkIn.value = isDate(params.get("checkIn")) ? params.get("checkIn")! : addDays(today, 7);
checkOut.value = isDate(params.get("checkOut")) ? params.get("checkOut")! : addDays(checkIn.value, 2);
if (/^[1-4]$/.test(params.get("guests") ?? "")) guests.value = params.get("guests")!;
let wantedRoom = radios.some((r) => r.value === params.get("room")) ? params.get("room") : null;

let stay = { checkIn: "", checkOut: "", guests: 2 };
let options: RoomOption[] = [];

// Keep the departure after the arrival as the arrival changes.
checkIn.addEventListener("change", () => {
  if (checkIn.value) checkOut.min = addDays(checkIn.value, 1);
  if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) checkOut.value = addDays(checkIn.value, 2);
});

// The rooms shown belong to the dates they were found for: changing the
// dates hides them until the next search.
search.addEventListener("input", () => {
  bookForm.hidden = true;
});

let focusResults = true;

search.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $<HTMLButtonElement>("button[type=submit]", search);
  if (isBusy(button)) return;
  const local: Record<string, string> = {};
  if (!checkIn.value) local.checkIn = "Enter the arrival date.";
  if (!checkOut.value) local.checkOut = "Enter the departure date.";
  else if (checkIn.value && checkOut.value <= checkIn.value) local.checkOut = "The departure date must be after the arrival date.";
  if (Object.keys(local).length) return showErrors(search, local);

  clearErrors(search);
  setBusy(button, true, "Looking…");
  const query = new URLSearchParams({ checkIn: checkIn.value, checkOut: checkOut.value, guests: guests.value });
  const answer = await api<{ roomTypes: RoomOption[] }>("GET", `/api/availability?${query}`);
  setBusy(button, false, "");
  if (!answer.ok) {
    if (answer.fields) return showErrors(search, answer.fields);
    return showErrors(search, { checkIn: answer.error }, "The rooms could not be checked:");
  }

  stay = { checkIn: checkIn.value, checkOut: checkOut.value, guests: Number(guests.value) };
  options = answer.roomTypes;
  history.replaceState(null, "", `?${query}${wantedRoom ? `&room=${encodeURIComponent(wantedRoom)}` : ""}`);
  renderRooms();
  done.hidden = true;
  bookForm.hidden = false;
  if (focusResults) $("#room-title").focus();
  focusResults = true;
});

// Arriving from a room page, or with dates in the address: show the free
// rooms at once, without moving focus away from the top of the page.
if (params.has("room") || params.has("checkIn")) {
  focusResults = false;
  search.requestSubmit();
}

function renderRooms() {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  $("[data-stay-summary]").textContent =
    `${formatDate(stay.checkIn)} to ${formatDate(stay.checkOut)}: ${plural(nights, "night")}, ${plural(stay.guests, "guest")}.`;

  const free = options.filter((o) => o.available > 0 && o.fitsGuests);
  const chosen = free.find((o) => o.roomType === wantedRoom) ?? free[0];
  for (const radio of radios) {
    const choice = radio.closest<HTMLElement>(".choice")!;
    const option = options.find((o) => o.roomType === radio.value);
    const price = $("[data-price]", choice);
    const freeText = $("[data-free]", choice);
    const usable = !!option && option.available > 0 && option.fitsGuests;
    radio.disabled = !usable;
    radio.checked = !!option && option === chosen;
    price.textContent = option ? `${formatLei(option.totalPrice)} for ${plural(nights, "night")}` : "";
    freeText.textContent = !option
      ? "Not offered for these dates"
      : !option.fitsGuests
        ? `Sleeps up to ${option.capacity}`
        : option.available === 0
          ? "Full for these dates"
          : option.available === 1
            ? "1 room free"
            : `${option.available} rooms free`;
    freeText.toggleAttribute("data-full", !usable);
  }

  const wanted = options.find((o) => o.roomType === wantedRoom);
  status.textContent = "";
  if (!chosen) {
    say(roomNote, "Nothing is free for these dates and guests. Try other dates.", "error");
  } else if (wanted && wanted !== chosen) {
    say(roomNote, `The ${wanted.name} is not free for these dates, so the ${chosen.name} is chosen instead. You can pick another free room.`);
  } else {
    roomNote.textContent = "";
  }
  updateRequestLine();
}

// The request in one sentence, right above the button that sends it.
function updateRequestLine() {
  const radio = radios.find((r) => r.checked);
  const option = options.find((o) => o.roomType === radio?.value);
  if (!option) {
    requestLine.textContent = "";
    return;
  }
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  requestLine.textContent =
    `${option.name}, ${formatDate(stay.checkIn)} to ${formatDate(stay.checkOut)}: ` +
    `${plural(nights, "night")} for ${plural(stay.guests, "guest")}, ${formatLei(option.totalPrice)} in all.`;
}

bookForm.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.name !== "roomType") return;
  wantedRoom = target.value;
  $("[data-error-for=roomType]", bookForm).textContent = "";
  updateRequestLine();
});

bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $<HTMLButtonElement>("button[type=submit]", bookForm);
  if (isBusy(button)) return;
  const data = new FormData(bookForm);
  const local: Record<string, string> = {};
  if (!data.get("roomType")) local.roomType = "Choose a room.";
  if (!String(data.get("name") ?? "").trim()) local.name = "Enter a name.";
  const email = String(data.get("email") ?? "").trim();
  if (!email) local.email = "Enter an email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) local.email = "Enter a valid email address, for example name@example.com.";
  if (Object.keys(local).length) return showErrors(bookForm, local);

  clearErrors(bookForm);
  status.textContent = "";
  setBusy(button, true, "Sending…");
  const notes = String(data.get("notes") ?? "").trim();
  const answer = await api<{ booking: Created }>("POST", "/api/bookings", {
    roomType: data.get("roomType"),
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    guests: stay.guests,
    name: String(data.get("name")).trim(),
    email,
    ...(notes ? { notes } : {}),
  });
  setBusy(button, false, "");

  if (!answer.ok) {
    // Problems with the dates belong to the first form.
    const fields = answer.fields ?? {};
    const dateFields = Object.fromEntries(Object.entries(fields).filter(([k]) => ["checkIn", "checkOut", "guests"].includes(k)));
    if (Object.keys(dateFields).length) return showErrors(search, dateFields);
    if (Object.keys(fields).length) return showErrors(bookForm, fields);
    return say(status, answer.error, "error");
  }
  showDone(answer.booking);
});

function showDone(b: Created) {
  $("[data-reference]").textContent = b.reference;
  const rows: [string, string][] = [
    ["Room", roomName(b.roomType)],
    ["Arrival", formatDate(b.checkIn)],
    ["Departure", formatDate(b.checkOut)],
    ["Stay", `${plural(b.nights, "night")}, ${plural(b.guests, "guest")}`],
    ["Total", `${formatLei(b.totalPrice)}, a sample price`],
  ];
  $("[data-summary]").replaceChildren(...rows.flatMap(([term, value]) => [h("dt", {}, term), h("dd", {}, value)]));
  // Reception's list of pending requests for these dates, after the demo login.
  const next = `/staff/bookings/?from=${b.checkIn}&to=${b.checkOut}&status=pending`;
  $<HTMLAnchorElement>("[data-reception-link]").href = `${receptionUrl}/staff/login/?next=${encodeURIComponent(next)}`;
  search.hidden = true;
  bookForm.hidden = true;
  done.hidden = false;
  $("#done-title").focus();
}
