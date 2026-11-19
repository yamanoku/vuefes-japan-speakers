import { defineConfig } from "@playwright/test";

const port = Number(process.env.VFJS_E2E_PORT ?? 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL,
    browserName: "chromium",
  },
  webServer: {
    command: `pnpm exec vp dev --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
