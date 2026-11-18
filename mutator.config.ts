import { defineConfig } from "@mizchi/mutator";

export default defineConfig({
  include: ["src/utils/**/*.ts", "src/composables/**/*.ts", "src/data/index.ts"],
  exclude: [
    "**/*.test.ts",
    // The translation table is copy. Mutating each string times out and does not describe behavior.
    "src/composables/useVfjsI18n.ts",
  ],
  runner: "vitest",
  // Browser Mode cannot load mutator's Node setup file.
  vitestConfig: "vitest.mutator.config.ts",
});
