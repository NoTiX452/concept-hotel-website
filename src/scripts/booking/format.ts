// How dates and money read on the page. Dates are YYYY-MM-DD in the hotel's
// time zone and are shown without converting them.
const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000);
}

// Today in the hotel's time zone, for the form's defaults. The app decides
// what is allowed.
export function hotelToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bucharest" }).format(new Date());
}

const lei = new Intl.NumberFormat("en-GB");
export const formatLei = (amount: number) => `${lei.format(amount)} lei`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
