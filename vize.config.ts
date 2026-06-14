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
});
