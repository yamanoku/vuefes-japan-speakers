import { defineConfig } from "vize";

export default defineConfig({
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
    include: ["app/**/*.art.vue"],
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
});
