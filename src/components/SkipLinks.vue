<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { extra } = defineProps<{
  extra?: Array<{ href: string; label: string }>;
}>();

const { t } = useVfjsI18n();
</script>

<template>
  <nav class="skip-nav" :aria-label="t.skip_links">
    <a class="skip-link" href="#main">
      {{ t.skip_to_main }}
    </a>
    <a v-for="link in extra ?? []" :key="link.href" class="skip-link" :href="link.href">
      {{ link.label }}
    </a>
  </nav>
</template>
