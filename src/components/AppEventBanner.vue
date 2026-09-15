<script setup lang="ts">
import { computed } from "vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";
import { isEventBannerVisible } from "../utils/eventBannerVisibility";

const { eventDate } = defineProps<{
  /** 開催日（YYYY-MM-DD）。当日までは表示し、翌日以降は非表示にする */
  eventDate: string;
}>();

const { t } = useVfjsI18n();
const visible = computed(() => isEventBannerVisible(eventDate));
</script>

<template>
  <!-- Vue Fes Japan 公式サイトへの誘導バナー（ヘッダー直下・全幅・開催日翌日以降は非表示） -->
  <div>
    <aside
      v-if="visible"
      class="border-b border-rule bg-accent"
      :aria-label="t.event_banner_2026_label"
    >
      <a
        class="block text-center px-pad-x py-[10px] font-body text-[13px] tracking-[-0.005em] text-accent-ink no-underline hover:underline transition-colors"
        href="https://vuefes.jp/2026/"
        :aria-label="`${t.event_banner_2026} (${t.external})`"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ t.event_banner_2026 }}
      </a>
    </aside>
  </div>
</template>
