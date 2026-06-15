import type { OxlintConfig } from "oxlint";
import type { UserConfig } from "vite-plus";

type FmtConfig = NonNullable<UserConfig["fmt"]>;
type RunTasks = NonNullable<NonNullable<UserConfig["run"]>["tasks"]>;
type LintPlugins = NonNullable<OxlintConfig["plugins"]>;

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
const lintPlugins = ["typescript", "oxc", "import", "unicorn", "vue"] satisfies LintPlugins;

export const lint = {
  plugins: lintPlugins,
  env: {
    builtin: true,
    browser: true,
    es2024: true,
    node: true,
  },
  ignorePatterns,
  rules: {
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
} satisfies OxlintConfig;

export const fmt = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all" as const,
  htmlWhitespaceSensitivity: "ignore" as const,
  sortPackageJson: true,
  ignorePatterns: fmtIgnorePatterns,
} satisfies FmtConfig;

export const runTasks = {
  lint: {
    command:
      'vp lint . --format stylish --max-warnings 0 && vize lint --help-level short --max-warnings 0 "src/**/*.vue"',
  },
  check: {
    command: "vp run lint && vp run format:check && vp run typecheck",
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
} satisfies RunTasks;
