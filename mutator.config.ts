import { defineConfig } from "@mizchi/mutator";

export default defineConfig({
  include: ["src/utils/**/*.ts", "src/composables/**/*.ts", "src/data/index.ts"],
  exclude: [
    "**/*.test.ts",
    // The translation table is copy. Mutating each string times out and does not describe behavior.
    "src/composables/useVfjsI18n.ts",
  ],
  runner: "vitest",
  // 0.4.0 injects its setup through vite-plus/test, but that file still uses Node
  // builtins. Vitest Browser Mode cannot load it, so unit mutation stays on happy-dom.
  // Browser source coverage is the Playwright config: mutator.playwright.config.ts.
  vitestConfig: "vitest.mutator.config.ts",
});
