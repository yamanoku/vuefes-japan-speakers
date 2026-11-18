import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@vizejs/vite-plugin/vite-plus";
import { vuerend } from "@vuerend/core/vite";
import type { PluginOption } from "vite-plus";

// mutator injects a Node setup file, which Vitest Browser Mode cannot load.
// Keep Vue compilation on vuerend, and run the existing tests in happy-dom.
export default defineConfig({
  compiler: false,
  plugins: [
    tailwindcss(),
    vuerend({
      app: "./src/app.ts",
      islands: "./src/islands.ts",
    }),
  ] as PluginOption[],
  resolve: {
    alias: {
      "@vue/server-renderer": fileURLToPath(
        new URL(
          "./node_modules/@vue/server-renderer/dist/server-renderer.esm-bundler.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
