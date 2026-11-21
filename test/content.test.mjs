// Rules for the hotel copy. Node runs the TypeScript content files directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hotel, rooms, dining, area, gettingHere, conceptNotice } from "../src/content/hotel.ts";
import { photos } from "../src/content/photos.ts";

test("room counts add up to the number of rooms the site states", () => {
  const total = rooms.reduce((sum, room) => sum + room.count, 0);
  assert.equal(total, hotel.rooms);
});

test("room addresses are unique and URL-safe", () => {
  const slugs = rooms.map((room) => room.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("every photo used in the copy has a slot in the photo list", () => {
  const used = [
    "hero",
    "house",
    ...rooms.map((r) => r.photo),
    ...dining.meals.map((m) => m.photo),
    ...area.places.map((p) => p.photo),
    gettingHere.photo,
  ];
  for (const name of used) assert.ok(name in photos, `no slot for photo "${name}"`);
});

test("credits, when filled in, point at Unsplash or Pexels", () => {
  for (const [name, slot] of Object.entries(photos)) {
    if (!slot.credit) continue;
    const host = new URL(slot.credit.url).hostname;
    assert.ok(/(^|\.)(unsplash\.com|pexels\.com)$/.test(host), `${name}: credit URL is on ${host}`);
    assert.ok(slot.credit.photographer.trim(), `${name}: photographer missing`);
  }
});

test("the concept notice says plainly that the hotel is not real", () => {
  assert.match(conceptNotice.short, /not a real hotel/);
  assert.match(conceptNotice.long, /made-up/);
  assert.match(conceptNotice.long, /nothing here can be booked/);
});

test("the copy invents no reviews, ratings, awards or stars", () => {
  const source = readFileSync(new URL("../src/content/hotel.ts", import.meta.url), "utf8");
  // Strip comments, which explain the rule itself.
  const copy = source.replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(copy, /\b(reviews?|rated|ratings?|awards?|award-winning|testimonials?|\d\s*stars?|five-star|four-star)\b/i);
});
