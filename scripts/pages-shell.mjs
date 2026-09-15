#!/usr/bin/env node
import { existsSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".output/public");
const assetsDir = join(dir, "assets");
if (!existsSync(assetsDir)) {
  console.error("[pages-shell] missing .output/public/assets");
  process.exit(1);
}

const files = readdirSync(assetsDir);
const css = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
const js = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
if (!css || !js) {
  console.error("[pages-shell] missing hashed css/js", files);
  process.exit(1);
}

const base = "/gail";
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>GAIL Energy Connect</title>
  <meta name="description" content="Jodo Pipeline. Jagao Shehar. Connect the JHBDPL network and energize eastern India in this GAIL social micro-game." />
  <meta name="theme-color" content="#07090E" />
  <link rel="icon" type="image/svg+xml" href="${base}/favicon.svg" />
  <link rel="stylesheet" href="${base}/assets/${css}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@600;700&family=Outfit:wght@400;500;600&family=Rajdhani:wght@500;600;700&display=swap" />
</head>
<body>
  <script type="module" src="${base}/assets/${js}"></script>
</body>
</html>
`;

const emptyIndex = join(dir, "index");
if (existsSync(emptyIndex)) unlinkSync(emptyIndex);
writeFileSync(join(dir, "index.html"), html);
writeFileSync(join(dir, "404.html"), html);
writeFileSync(join(dir, ".nojekyll"), "");
console.log(`[pages-shell] wrote index.html + 404.html (${js}, ${css})`);
