import { defineConfig } from "astro/config";

// SITE_URL is the public address of the demo, used for canonical links.
export default defineConfig({
  site: process.env.SITE_URL ?? "http://localhost:4321",
});
