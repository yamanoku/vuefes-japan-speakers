import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui', '@nuxt/a11y'],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 5,
  },

  experimental: { nitroAutoImports: true },

  compatibilityDate: '2024-07-30',

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: true,
      },
      typescript: true,
    },
  },
});
