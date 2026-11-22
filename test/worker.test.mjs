// The Worker that passes guest calls to the booking app: only the three guest
// routes go through, cookies stay behind, and every answer carries the API
// security headers.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.ts";

const SITE = "https://hotel.example.test";

function setup(booking = async () => Response.json({ ok: true })) {
  const seen = [];
  const env = {
    ASSETS: { fetch: async () => new Response("a static file") },
    BOOKING: {
      fetch: async (request) => {
        seen.push(request);
        return booking(request);
      },
    },
  };
  const call = (method, path, init = {}) => worker.fetch(new Request(`${SITE}${path}`, { method, ...init }), env, {});
  return { call, seen };
}

test("the guest calls reach the booking app with this site's address and Origin", async () => {
  const { call, seen } = setup();
  await call("GET", "/api/room-types");
  await call("GET", "/api/availability?checkIn=2026-12-01&checkOut=2026-12-03&guests=2");
  await call("POST", "/api/bookings", {
    headers: { origin: SITE, "content-type": "application/json", "cf-connecting-ip": "203.0.113.7" },
    body: JSON.stringify({ name: "Ana" }),
  });
  assert.deepEqual(
    seen.map((r) => `${r.method} ${r.url}`),
    [
      `GET ${SITE}/api/room-types`,
      `GET ${SITE}/api/availability?checkIn=2026-12-01&checkOut=2026-12-03&guests=2`,
      `POST ${SITE}/api/bookings`,
    ],
  );
  const post = seen[2];
  assert.equal(post.headers.get("origin"), SITE);
  // The app's rate limit counts each guest by this address.
  assert.equal(post.headers.get("cf-connecting-ip"), "203.0.113.7");
  assert.deepEqual(await post.json(), { name: "Ana" });
});

test("the staff API and unknown addresses are never passed on", async () => {
  const { call, seen } = setup();
  for (const path of ["/api/staff/bookings", "/api/staff/session", "/api/health", "/api/bookings/1", "/api/bookings/", "/api/"]) {
    const res = await call("GET", path);
    assert.equal(res.status, 404, path);
  }
  assert.equal(seen.length, 0);
});

test("a guest route with the wrong method is refused here", async () => {
  const { call, seen } = setup();
  const res = await call("DELETE", "/api/bookings");
  assert.equal(res.status, 405);
  assert.equal(res.headers.get("allow"), "POST");
  assert.equal(seen.length, 0);
});

test("cookies stay on this site", async () => {
  const { call, seen } = setup();
  await call("GET", "/api/room-types", { headers: { cookie: "anything=1" } });
  assert.equal(seen[0].headers.get("cookie"), null);
});

test("answers carry the API security headers, passed through or not", async () => {
  const { call } = setup(async () => new Response('{"ok":true}', { status: 201, headers: { "content-type": "application/json" } }));
  for (const res of [await call("GET", "/api/room-types"), await call("GET", "/api/staff/bookings")]) {
    assert.equal(res.headers.get("content-security-policy"), "default-src 'none'; frame-ancestors 'none'");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("cache-control"), "no-store");
  }
  const passed = await call("GET", "/api/room-types");
  assert.equal(passed.status, 201);
  assert.equal(await passed.text(), '{"ok":true}');
});

test("an unreachable booking app gets a clear answer, not a crash", async () => {
  const { call } = setup(async () => {
    throw new Error("no such service");
  });
  const original = console.error;
  console.error = () => {};
  try {
    const res = await call("GET", "/api/room-types");
    assert.equal(res.status, 503);
    assert.match((await res.json()).error, /could not be reached/);
  } finally {
    console.error = original;
  }
});

test("everything outside /api/ is a static file", async () => {
  const { call, seen } = setup();
  for (const path of ["/", "/book/", "/rooms/loft-suite/", "/apis"]) {
    assert.equal(await (await call("GET", path)).text(), "a static file", path);
  }
  assert.equal(seen.length, 0);
});
