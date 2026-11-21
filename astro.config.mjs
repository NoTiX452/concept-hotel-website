import { defineConfig } from "astro/config";

// The public address of the demo, used for canonical links. SITE_URL overrides
// it, for example when the demo moves to its own domain.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://concept-hotel.concept-hotel-website.workers.dev",
});
