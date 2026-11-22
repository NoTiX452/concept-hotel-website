// The hotel website's Worker. Pages are static files; only /api/* runs this
// code (see run_worker_first in wrangler.jsonc).
//
// Guests request a stay on /book/. The page calls this site's /api/*, and the
// Worker passes the three guest calls to the concept booking app
// (NoTiX452/concept-booking-app) through a service binding: a direct link
// between two Workers on the same Cloudflare account. So the browser only
// ever talks to this site (no cross-site requests, no CORS), and the app's
// staff API cannot be reached from here at all.
//
// The request goes on with this page's own address and Origin, which is what
// the app's Origin check expects. Cookies stay behind: the app has no reason
// to see them.

export interface Env {
  ASSETS: Fetcher;
  BOOKING: Fetcher;
}

// The guest API, method by path. Everything else under /api/ is a 404.
export const GUEST_ROUTES: Record<string, string> = {
  "/api/room-types": "GET",
  "/api/availability": "GET",
  "/api/bookings": "POST",
};

// On every API answer, the app's or this Worker's own: JSON is never cached,
// never sniffed as a page, and never framed.
const SECURITY_HEADERS = {
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

function problem(status: number, error: string, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...SECURITY_HEADERS, ...extra },
  });
}

function secured(response: Response): Response {
  const copy = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) copy.headers.set(name, value);
  return copy;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    const method = GUEST_ROUTES[url.pathname];
    if (!method) return problem(404, "Not found.");
    if (request.method !== method) return problem(405, "Method not allowed.", { allow: method });

    const headers = new Headers(request.headers);
    headers.delete("cookie");
    try {
      return secured(await env.BOOKING.fetch(new Request(request, { headers })));
    } catch (error) {
      console.error(`Booking app unreachable for ${request.method} ${url.pathname}: ${String(error)}`);
      return problem(503, "The booking app could not be reached. Try again in a moment.");
    }
  },
} satisfies ExportedHandler<Env>;
