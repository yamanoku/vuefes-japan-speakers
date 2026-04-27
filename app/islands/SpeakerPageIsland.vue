<script setup lang="ts">
import { computed } from "vue";
import type { SpeakerWithYear } from "../../types";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";
import { compareLexicalJa } from "../utils/stringCollate";
import { hasJapanese } from "../utils/speakerMap";

const props = defineProps<{
  found: boolean;
  speakerName: string;
  speakers: SpeakerWithYear[];
}>();

const { t, lang } = useVfjsI18n();

const record = computed(() => {
  let nameRuby: string | undefined;
  let nameEn: string | undefined;
  for (const speaker of props.speakers) {
    const index = speaker.name.indexOf(props.speakerName);
    if (index >= 0) {
      if (!nameRuby && speaker.nameRuby?.[index]) nameRuby = speaker.nameRuby[index];
      if (!nameEn && speaker.nameEn?.[index]) nameEn = speaker.nameEn[index];
      if (nameRuby && nameEn) break;
    }
  }
  const talks = props.speakers
    .map((speaker) => ({
      year: speaker.year,
      title: speaker.title,
      url: speaker.url,
      format: speaker.format,
      coSpeakers: speaker.name.filter((name) => name !== props.speakerName),
    }))
    .sort((a, b) => compareLexicalJa(a.year, b.year));
  const years = [...new Set(talks.map((talk) => talk.year))].sort();
  return { name: props.speakerName, nameRuby, nameEn, years, talks };
});
</script>

<template>
  <div>
    <AppHeader />

    <!-- スピーカーページのメインコンテンツ（該当スピーカーが存在する場合） -->
    <template v-if="found">
      <!-- スピーカーページのヘッダー（名前・登壇回数・登壇年度） -->
      <header
        class="border-b border-rule pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-pad-x"
      >
        <!-- スピーカー名 -->
        <h1
          class="font-display text-[clamp(28px,4.5vw,72px)] font-bold leading-[1] mb-4"
          :lang="hasJapanese(record.name) ? 'ja' : 'en'"
        >
          <ruby v-if="record.nameRuby && lang === 'ja'">
            {{ record.name }}
            <rt>{{ record.nameRuby }}</rt>
          </ruby>
          <template v-else>
            {{ lang === "en" && record.nameEn ? record.nameEn : record.name }}
          </template>
        </h1>
        <div class="font-mono text-ink-3">
          <!-- 総登壇回数 -->
          <div>{{ t.appearance_count(record.talks.length) }}</div>
          <!-- 登壇年度のリスト（各年度ページへのリンク） -->
          <div class="mt-2 text-[12px] text-ink-2">
            {{ t.years_appeared }}:
            <template v-for="(year, index) in record.years" :key="year">
              <template v-if="index > 0">,</template>
              <a :href="`/${year}`" class="text-ink underline hover:no-underline">
                {{ year }}
              </a>
            </template>
          </div>
        </div>
      </header>

      <!-- 関連トーク一覧セクション -->
      <section class="px-pad-x py-10">
        <h2 class="font-mono tracking-[0.1em] text-ink-3 mb-4">
          {{ t.related_talks }}
        </h2>
        <ul class="list-none p-0 m-0">
          <li
            v-for="(talk, index) in record.talks"
            :key="index"
            class="grid grid-cols-[40px_1fr] gap-x-4 border-t border-rule-softer py-4.5"
          >
            <!-- 開催年リンク（年度別ページへ） -->
            <span class="font-mono text-[12px] text-ink-3 text-center pt-[3px]">
              <a class="text-ink underline hover:no-underline" :href="`/${talk.year}`">
                {{ talk.year }}
              </a>
            </span>
            <div class="flex flex-col gap-y-2">
              <!-- トークタイトル（外部リンク） -->
              <a
                class="text-[16px] text-ink no-underline group flex flex-wrap items-baseline gap-2"
                :href="talk.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <!-- パネルセッションのフォーマットバッジ -->
                <span
                  v-if="talk.format === 'panel'"
                  class="relative top-[-1px] inline-flex items-center self-center align-middle font-mono text-[10px] uppercase tracking-[0.06em] border border-ink text-ink px-[5px] py-[1px] leading-[1.15]"
                >
                  {{ t.session_format_panel }}
                </span>
                <span>
                  <span
                    :lang="hasJapanese(talk.title || '') ? 'ja' : 'en'"
                    class="group-hover:underline"
                  >
                    {{ talk.title || t.tbd }}
                  </span>
                  <span class="text-[10px] ml-1">({{ t.external }})</span>
                </span>
              </a>
              <!-- 共同登壇者のリスト（各スピーカープロフィールへのリンク） -->
              <span v-if="talk.coSpeakers.length > 0" class="text-[12px] font-mono text-ink-3">
                w/
                <template
                  v-for="(coSpeakerName, coSpeakerIndex) in talk.coSpeakers"
                  :key="coSpeakerName"
                >
                  <template v-if="coSpeakerIndex > 0">,</template>
                  <a
                    class="text-ink underline hover:no-underline"
                    :href="`/speakers/${encodeURIComponent(coSpeakerName)}`"
                  >
                    {{ coSpeakerName }}
                  </a>
                </template>
              </span>
            </div>
          </li>
        </ul>
      </section>
    </template>

    <!-- スピーカーが存在しない場合 -->
    <main v-else class="px-pad-x py-20 font-mono text-[14px] text-ink-2">
      <h1 class="font-display text-[40px] text-ink m-0">Speaker Not Found</h1>
      <p>{{ speakerName }}</p>
    </main>

    <AppFooter />
  </div>
</template>
