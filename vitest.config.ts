import { fileURLToPath, URL } from "node:url";
import vize from "@vizejs/vite-plugin";
import { defineConfig } from "vite-plus/test/config";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  plugins: [
    vize({
      scanPatterns: ["app/**/*.vue"],
      ignorePatterns: ["node_modules/**", "dist/**", ".cache/**"],
    }),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "~~": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
