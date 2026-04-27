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
    <div class="grid grid-cols-12 gap-6">
      <!-- ロゴマークとページタイトル -->
      <div
        class="col-span-9 flex items-center gap-[clamp(18px,2.4vw,34px)] max-[800px]:col-span-12 max-[560px]:flex-col max-[560px]:items-start"
      >
        <AppLogoMark
          class="w-[clamp(42px,5vw,72px)] h-auto text-ink mb-[0.08em] max-[560px]:mb-0"
        />
        <!-- ページタイトル -->
        <h1
          class="m-0 font-display font-[500] text-[clamp(38px,6.2vw,104px)] leading-[0.96] text-ink break-keep"
        >
          <span>Vue Fes Japan Speakers</span>
        </h1>
      </div>
      <!-- アーカイブ統計情報（スピーカー数・トーク数・開催年数） -->
      <aside
        class="grid items-center col-span-3 font-mono text-[20px] leading-[1.7] tracking-[0.06em] border-l border-rule pl-4 max-[800px]:col-span-12 max-[800px]:border-l-0 max-[800px]:pl-0 max-[800px]:border-t max-[800px]:pt-4"
        aria-label="Archive scope"
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
      <!-- 説明文 -->
      <p
        class="col-span-9 mt-7 text-[clamp(16px,1.4vw,20px)] text-ink-2 leading-[1.5] m-0 max-[800px]:col-span-12"
      >
        {{ t.sub_all }}
      </p>
    </div>
  </section>
</template>
