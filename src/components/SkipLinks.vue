<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <nav class="skip-nav" :aria-label="t.skip_links">
    <a class="skip-link" href="#main">
      {{ t.skip_to_main }}
    </a>
    <slot />
  </nav>
</template>
