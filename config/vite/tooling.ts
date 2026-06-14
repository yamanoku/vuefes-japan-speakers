import type { OxlintConfig } from "oxlint";
import { configs as vizeLintConfigs } from "oxlint-plugin-vize";

const ignorePatterns = [
  "**/.cache/**",
  "**/.data/**",
  "**/.nuxt/**",
  "**/.nitro/**",
  "**/.output/**",
  "**/dist/**",
  "**/node_modules/**",
  "**/public/**",
];
const fmtIgnorePatterns = [...ignorePatterns, "**/*.vue"];

export const lint: OxlintConfig = {
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
    ...vizeLintConfigs.opinionated,
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "warn",
    "import/no-duplicates": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-explicit-any": "error",
  } as const,
  globals: {
    defineEmits: "readonly",
    defineExpose: "readonly",
    defineProps: "readonly",
    withDefaults: "readonly",
  },
};

export const fmt = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all" as const,
  htmlWhitespaceSensitivity: "ignore" as const,
  sortPackageJson: true,
  ignorePatterns: fmtIgnorePatterns,
};

export const runTasks = {
  check: {
    command: "vp lint . && vp run format:check && vp run typecheck",
  },
  format: {
    command: "vp fmt . --write && vize fmt --write $(find src -name '*.vue' ! -name '*.art.vue')",
  },
  "format:check": {
    command: "vp fmt . --check && vize fmt --check $(find src -name '*.vue' ! -name '*.art.vue')",
  },
  typecheck: {
    command: "vize check --tsconfig tsconfig.vize.json",
  },
};
