import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vize from "@vizejs/vite-plugin";
import { vuerend } from "@vuerend/core/vite";
import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const ignorePatterns = [
  "**/.cache/**",
  "**/.data/**",
  "**/.nuxt/**",
  "**/.nitro/**",
  "**/.output/**",
  "**/dist/**",
  "**/node_modules/**",
  "**/public/**",
  "**/__agent_only/**",
  "**/__oxlint_plugin_vize_temp__/**",
];

const lint = {
  $schema: "./node_modules/oxlint/configuration_schema.json",
  plugins: ["typescript", "oxc", "import", "unicorn", "vue"] as [
    "typescript",
    "oxc",
    "import",
    "unicorn",
    "vue",
  ],
  jsPlugins: ["oxlint-plugin-vize"],
  settings: {
    vize: {
      preset: "opinionated",
      helpLevel: "short",
    },
  },
  env: {
    builtin: true,
    browser: true,
    es2024: true,
    node: true,
  },
  ignorePatterns,
  rules: {
    "vize/vue/require-v-for-key": "error",
    "vize/vue/no-v-html": "warn",
    "vize/vue/no-unused-vars": "warn",
    "vize/vue/valid-v-bind": "error",
    "vize/vue/valid-v-for": "error",
    "vize/vue/valid-v-if": "error",
    "vize/vue/valid-v-model": "error",
    "vize/vue/valid-v-on": "error",
    "vize/vue/valid-v-slot": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "warn",
    "import/no-duplicates": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-explicit-any": "error",
    "vue/no-arrow-functions-in-watch": "error",
    "vue/no-export-in-script-setup": "error",
    "vue/no-lifecycle-after-await": "error",
    "vue/prefer-import-from-vue": "error",
    "vue/valid-define-emits": "error",
    "vue/valid-define-props": "error",
  } as const,
  globals: {
    defineEmits: "readonly",
    defineExpose: "readonly",
    defineProps: "readonly",
    withDefaults: "readonly",
  },
};

const fmt = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all" as const,
  htmlWhitespaceSensitivity: "ignore" as const,
  sortPackageJson: true,
  ignorePatterns,
};

export { fmt, lint };

export default defineConfig({
  plugins: [
    tailwindcss(),
    vuerend({
      app: "./app/app.ts",
      islands: "./app/islands.ts",
      vuePlugin: vize({
        scanPatterns: ["app/**/*.vue"],
        ignorePatterns: ["node_modules/**", "dist/**", ".cache/**"],
      }),
    }),
  ],
  resolve: {
    alias: {
      // Vize SSR imports the package root; Vite's module runner needs the ESM build.
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
    tasks: {
      build: {
        command: "vp build",
      },
      check: {
        command: "vp run lint && vp run typecheck",
      },
      dev: {
        command: "vp dev",
        cache: false,
      },
      fmt: {
        command: "vp fmt .",
      },
      "fmt:check": {
        command: "vp fmt . --check",
      },
      generate: {
        command: "vp build",
      },
      lint: {
        command: "vp lint .",
      },
      preview: {
        command: "vp preview --outDir dist/client",
        cache: false,
      },
      test: {
        command: "vp test run",
      },
      "test:watch": {
        command: "vp test watch",
        cache: false,
      },
      typecheck: {
        command: "vize check --servers 1 --tsconfig tsconfig.vize.json",
      },
    },
  },
  fmt,
  lint,
});
