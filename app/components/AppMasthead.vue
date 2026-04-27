<script setup lang="ts">
import AppLogoMark from "./AppLogoMark.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

defineProps<{
  stats: { speakers: number; talks: number; years: number };
}>();

const { t } = useVfjsI18n();
</script>

<template>
  <section
    class="border-b border-rule pt-[clamp(48px,8vw,120px)] pb-[clamp(40px,6vw,72px)] px-pad-x"
  >
    <div class="flex flex-wrap gap-6">
      <!-- ロゴマークとページタイトル -->
      <div
        class="basis-0 grow-999 min-inline-[60%] flex flex-wrap items-center gap-[clamp(18px,2.4vw,34px)]"
      >
        <AppLogoMark class="basis-15 grow-1 max-w-[60px] h-auto text-ink" />
        <!-- ページタイトル -->
        <h1
          class="basis-0 grow-999 min-inline-[80%] m-0 font-display font-[500] text-[clamp(38px,6.2vw,104px)] leading-[0.96] text-ink break-keep"
        >
          <span>Vue Fes Japan Speakers</span>
        </h1>
      </div>
      <!-- アーカイブ統計情報（スピーカー数・トーク数・開催年数） -->
      <aside
        class="basis-80 grow-1 grid items-center col-span-3 font-mono text-[20px] leading-[1.7] tracking-[0.06em] py-4 border-bs-1 border-be-1 border-rule-soft"
      >
        <!-- 総スピーカー数 -->
        <div>
          <b class="text-ink font-[500] not-italic">
            {{ stats.speakers }}
          </b>
          {{ t.meta_speakers }}
        </div>
        <!-- 総トーク数 -->
        <div>
          <b class="text-ink font-[500] not-italic">
            {{ stats.talks }}
          </b>
          {{ t.meta_talks }}
        </div>
        <!-- 開催年数 -->
        <div>
          <b class="text-ink font-[500] not-italic">
            {{ stats.years }}
          </b>
          {{ t.meta_years }}
        </div>
      </aside>
    </div>
    <!-- 説明文 -->
    <p class="mt-7 text-[clamp(16px,1.4vw,20px)] text-ink-2 leading-[1.5] m-0">
      {{ t.sub_all }}
    </p>
  </section>
</template>
