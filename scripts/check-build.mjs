// Checks every built page after `astro build`:
// - it links a stylesheet (a build from a lowercase drive path on Windows,
//   such as Git Bash's d:\..., can silently drop every stylesheet);
// - it shows the concept notice, so no page can be mistaken for a real hotel.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "dist";
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) pages.push(path);
  }
};

try {
  walk(root);
} catch {
  console.error(`check-build: no ${root}/ folder. Run the build first.`);
  process.exit(1);
}

const problems = [];
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  if (!/<link[^>]+href="[^"]+\.css"/.test(html)) problems.push(`${page}: no stylesheet`);
  if (!html.includes("Concept project.")) problems.push(`${page}: no concept notice`);
}

if (pages.length === 0 || problems.length > 0) {
  console.error(`check-build: ${problems.length} problem(s) in ${pages.length} pages:`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("On Windows, build from PowerShell or a path that starts with an uppercase drive letter.");
  process.exit(1);
}
console.log(`check-build: all ${pages.length} pages link their stylesheets and show the concept notice.`);
