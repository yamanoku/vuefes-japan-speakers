import { defineVitestConfig } from '@nuxt/test-utils/config';
import { playwright } from 'vite-plus/test/browser-playwright';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
