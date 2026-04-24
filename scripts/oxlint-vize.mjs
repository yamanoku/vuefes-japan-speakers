import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const configUrl = pathToFileURL(resolve("vite.config.ts")).href;
const configModule = await import(configUrl);
const lintConfig = configModule.lint ?? configModule.default?.lint;

if (!lintConfig || typeof lintConfig !== "object") {
  throw new TypeError("vite.config.ts must export a lint configuration.");
}

const configPath = resolve(".cache/vize/oxlint.config.json");
mkdirSync(dirname(configPath), { recursive: true });
writeFileSync(configPath, `${JSON.stringify(lintConfig, null, 2)}\n`);

const result = spawnSync("oxlint-vize", ["-c", configPath, ...process.argv.slice(2)], {
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
