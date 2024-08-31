// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  languageOptions: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
  },
}).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
});
