const lint = {
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'oxc', 'import', 'unicorn', 'vue'],
  jsPlugins: ['oxlint-plugin-vize'],
  settings: {
    vize: {
      preset: 'nuxt',
      helpLevel: 'short',
    },
  },
  env: {
    builtin: true,
    browser: true,
    node: true,
    es2024: true,
  },
  ignorePatterns: [
    '**/.output/**',
    '**/.data/**',
    '**/.nuxt/**',
    '**/.nitro/**',
    '**/.cache/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/public/**',
    '**/__agent_only/**',
    '**/__oxlint_plugin_vize_temp__/**',
  ],
  rules: {
    'vize/vue/require-v-for-key': 'error',
    'vize/vue/no-v-html': 'warn',
    'vize/vue/no-unused-vars': 'warn',
    'vize/vue/valid-v-bind': 'error',
    'vize/vue/valid-v-for': 'error',
    'vize/vue/valid-v-if': 'error',
    'vize/vue/valid-v-model': 'error',
    'vize/vue/valid-v-on': 'error',
    'vize/vue/valid-v-slot': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    'import/no-duplicates': 'error',
    'typescript/no-explicit-any': 'error',
  },
};

export { lint };

export default {
  lint,
};
