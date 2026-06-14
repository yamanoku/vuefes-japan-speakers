import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { vuerend } from "@vuerend/core/vite";
import type { PluginOption } from "vite-plus";
import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { cloudflarePages404, museaGallery, staticHtmlPreview } from "./config/vite/plugins";
import { fmt, lint, runTasks } from "./config/vite/tooling";

export { fmt, lint };

export default defineConfig({
  plugins: [
    tailwindcss(),
    ...museaGallery(),
    vuerend({
      app: "./src/app.ts",
      islands: "./src/islands.ts",
    }),
    staticHtmlPreview(),
    cloudflarePages404(),
  ] as PluginOption[],
  resolve: {
    alias: {
      // Keep the SSR renderer on the ESM entry for Vite's module runner.
      "@vue/server-renderer": fileURLToPath(
        new URL(
          "./node_modules/@vue/server-renderer/dist/server-renderer.esm-bundler.js",
          import.meta.url,
        ),
      ),
    },
  },
  staged: {
    "*": "vp run check",
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
  run: {
    tasks: runTasks,
  },
  fmt,
  lint,
});
