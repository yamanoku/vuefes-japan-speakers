<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <!-- 本文へジャンプするスキップリンク（フォーカス時のみ表示）。ページ固有のリンクは slot で追加する -->
  <nav class="skip-links" :aria-label="t.skip_links">
    <a class="skip-link" href="#main">
      {{ t.skip_to_main }}
    </a>
    <slot />
  </nav>
</template>
