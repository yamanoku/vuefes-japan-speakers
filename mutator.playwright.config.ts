import { defineConfig } from "@mizchi/mutator";

// Same sources as mutator.config.ts. Playwright is opt-in because each mutant
// starts a browser test process. Source coverage records which E2E runs each
// original function, including functions with no mutation candidates.
export default defineConfig({
  include: ["src/utils/**/*.ts", "src/composables/**/*.ts", "src/data/index.ts"],
  exclude: [
    "**/*.test.ts",
    // The translation table is copy. Mutating each string times out and does not describe behavior.
    "src/composables/useVfjsI18n.ts",
  ],
  runner: "playwright",
  playwrightConfig: "playwright.config.ts",
  playwrightSourceCoverage: true,
  concurrency: 2,
});
