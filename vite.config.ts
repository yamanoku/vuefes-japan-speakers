import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type VueOptions } from "@vizejs/vite-plugin/vite-plus";
import { vuerend } from "@vuerend/core/vite";
import type { PluginOption } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { cloudflarePages404, museaGallery, staticHtmlPreview } from "./config/vite/plugins";
import { fmt, lint, runTasks } from "./config/vite/tooling";

export { fmt, lint };

const vueConfig = {
  compiler: {
    templateSyntax: "strict",
  },
  linter: {
    preset: "opinionated",
  },
  formatter: {
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
  },
  musea: {
    include: ["src/**/*.art.vue"],
    exclude: ["node_modules/**", "dist/**", ".cache/**"],
    basePath: "/__musea__",
    inlineArt: false,
    a11y: {
      enabled: true,
    },
    vrt: {
      viewports: [
        { name: "mobile", width: 390, height: 844 },
        { name: "desktop", width: 1280, height: 720 },
      ],
    },
  },
} satisfies VueOptions;

export default defineConfig({
  // Leave SFC compilation to vuerend. Vize still reads vue for lint, format, and typecheck.
  compiler: false,
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
    // vize check rejects a commit when every staged path is outside the
    // TypeScript project, which is what workflow-only changes hit.
    "*.{ts,tsx,vue,js,mjs,cjs,mts,cts}": "vp run check",
    "*.{yml,yaml,json,md,css}": "vp fmt --check",
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
}).withVue(vueConfig);
