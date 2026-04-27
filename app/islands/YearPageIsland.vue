<script setup lang="ts">
import type { SpeakerInfo } from "../../types";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

defineProps<{
  found: boolean;
  speakers: SpeakerInfo[];
  year: string;
}>();

const { t, lang } = useVfjsI18n();
</script>

<template>
  <div>
    <AppHeader />

    <!-- 年度ページのメインコンテンツ（該当年度が存在する場合） -->
    <main v-if="found">
      <!-- 年度ページのヘッダー（タイトル・トーク数・公式サイトリンク） -->
      <header
        class="border-b border-[var(--rule)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-[var(--pad-x)]"
      >
        <!-- 年度タイトル（2022年はオンライン開催のサブ表記付き） -->
        <h1
          class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-[500] leading-[1] mb-[16px]"
        >
          Vue Fes Japan
          <span v-if="year === '2022'">Online</span>
          <em class="not-italic text-[var(--accent)]">{{ year }}</em>
        </h1>
        <div class="[font-family:var(--font-mono)] text-[var(--ink-3)]">
          <!-- その年のトーク総数 -->
          <div>{{ t.year_total_talks(speakers.length) }}</div>
          <!-- 公式サイトへの外部リンク -->
          <div class="mt-[8px] text-[12px]">
            <a
              :href="`https://vuefes.jp/${year}/`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block text-[var(--ink-2)] no-underline group flex items-baseline gap-[4px]"
            >
              <span class="group-hover:underline">{{ t.official_site }}</span>
              <span class="text-[10px]">({{ t.external }})</span>
            </a>
          </div>
        </div>
      </header>

      <!-- その年のスピーカー一覧セクション -->
      <section class="px-[var(--pad-x)] py-[40px] border-b border-[var(--rule-softer)]">
        <h2 class="[font-family:var(--font-mono)] tracking-[0.1em] text-[var(--ink-3)] mb-[16px]">
          {{ t.all_speakers }}
        </h2>
        <ol class="list-none p-0 m-0">
          <!-- 各スピーカーの行 -->
          <li
            v-for="(speaker, index) in speakers"
            :key="index"
            class="grid grid-cols-[40px_1fr] border-t border-[var(--rule-softer)] py-[18px]"
          >
            <!-- 行番号（表示専用） -->
            <div
              class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] pt-[5px] text-center"
              aria-hidden="true"
            >
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
            </div>
            <div class="pr-[24px]">
              <!-- スピーカー名（複数名対応・振り仮名・英語名対応、プロフィールページへのリンク） -->
              <div class="flex flex-wrap gap-x-[8px] gap-y-[4px] mb-[6px] items-center">
                <template v-for="(name, nameIndex) in speaker.name" :key="name">
                  <span
                    v-if="nameIndex > 0"
                    class="text-[var(--ink-2)] text-[12px]"
                    aria-hidden="true"
                  >
                    ×
                  </span>
                  <a
                    class="text-[18px] [font-family:var(--font-mono)] border-b border-[var(--rule-soft)] pb-[1px] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :href="`/speakers/${encodeURIComponent(name)}`"
                  >
                    <ruby v-if="speaker.nameRuby?.[nameIndex] && lang === 'ja'" lang="ja">
                      {{ name }}
                      <rt>{{ speaker.nameRuby[nameIndex] }}</rt>
                    </ruby>
                    <span v-else>
                      {{
                        lang === "en" && speaker.nameEn?.[nameIndex]
                          ? speaker.nameEn[nameIndex]
                          : name
                      }}
                    </span>
                  </a>
                </template>
              </div>
              <!-- トークタイトル（外部リンク、未決定の場合は TBD 表示） -->
              <div class="text-[14px] text-[var(--ink-2)]">
                <a
                  v-if="speaker.title"
                  :href="speaker.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="no-underline group"
                >
                  <!-- パネルセッションのフォーマットバッジ -->
                  <span
                    v-if="speaker.format === 'panel'"
                    class="relative top-[-1px] inline-flex items-center self-center align-middle [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] border border-[var(--ink)] text-[var(--ink)] px-[5px] py-[1px] leading-[1.15] mr-[8px]"
                  >
                    {{ t.session_format_panel }}
                  </span>
                  <span class="group-hover:underline">{{ speaker.title }}</span>
                  <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
                </a>
                <!-- タイトル未決定時のプレースホルダー -->
                <span v-else class="italic text-[var(--ink-2)] no-underline">{{ t.tbd }}</span>
              </div>
            </div>
          </li>
        </ol>
      </section>
    </main>

    <!-- 年度が存在しない場合 -->
    <main
      v-else
      class="px-[var(--pad-x)] py-[80px] [font-family:var(--font-mono)] text-[14px] text-[var(--ink-2)]"
    >
      <h1 class="[font-family:var(--font-display)] text-[40px] text-[var(--ink)] m-0">
        Year Not Found
      </h1>
      <p>{{ year }}</p>
    </main>

    <!-- サイトフッター -->
    <AppFooter />
  </div>
</template>
