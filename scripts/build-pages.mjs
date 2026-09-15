#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const env = { ...process.env, NITRO_PRESET: "github_pages" };
const viteBin = join(process.cwd(), "node_modules", ".bin", "vite");
const child = spawn(process.execPath, ["scripts/with-app-env.mjs", viteBin, "build"], {
  stdio: "inherit",
  env,
});

child.on("exit", () => {
  const assets = join(process.cwd(), ".output/public/assets");
  if (!existsSync(assets)) process.exit(1);
  const shell = spawn(process.execPath, ["scripts/pages-shell.mjs"], { stdio: "inherit" });
  shell.on("exit", (shellCode) => process.exit(shellCode ?? 1));
});
