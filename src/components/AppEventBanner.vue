<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <!-- Vue Fes Japan 2026 公式サイトへの誘導バナー（ヘッダー直下・全幅） -->
  <aside class="border-b border-rule bg-paper-2" :aria-label="t.event_banner_2026_label">
    <a
      class="block text-center px-pad-x py-[10px] font-body text-[13px] tracking-[-0.005em] text-ink no-underline hover:text-accent transition-colors"
      href="https://vuefes.jp/2026/"
      :aria-label="`${t.event_banner_2026} (${t.external})`"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ t.event_banner_2026 }}
    </a>
  </aside>
</template>
