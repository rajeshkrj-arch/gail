#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const env = { ...process.env, NITRO_PRESET: "github_pages" };
const child = spawn("node", ["scripts/with-app-env.mjs", "vite", "build"], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  const assets = join(process.cwd(), ".output/public/assets");
  if (!existsSync(assets)) {
    process.exit(code === 0 ? 1 : code ?? 1);
  }
  const shell = spawn("node", ["scripts/pages-shell.mjs"], { stdio: "inherit" });
  shell.on("exit", (shellCode) => process.exit(shellCode ?? 1));
});
