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

    <template v-if="found">
      <header
        class="border-b border-[var(--rule)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-[var(--pad-x)]"
      >
        <h1
          class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-bold leading-[1] mb-[16px]"
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
        <div class="[font-family:var(--font-mono)] text-[var(--ink-3)]">
          <div>{{ t.appearance_count(record.talks.length) }}</div>
          <div class="mt-[8px] text-[12px] text-[var(--ink-2)]">
            {{ t.years_appeared }}:
            <template v-for="(year, index) in record.years" :key="year">
              <template v-if="index > 0">,</template>
              <a :href="`/${year}`" class="text-[var(--ink)] underline hover:no-underline">
                {{ year }}
              </a>
            </template>
          </div>
        </div>
      </header>

      <section class="px-[var(--pad-x)] py-[40px]">
        <h2 class="[font-family:var(--font-mono)] tracking-[0.1em] text-[var(--ink-3)] mb-[16px]">
          {{ t.related_talks }}
        </h2>
        <ul class="list-none p-0 m-0">
          <li
            v-for="(talk, index) in record.talks"
            :key="index"
            class="grid grid-cols-[40px_1fr] gap-x-[16px] border-t border-[var(--rule-softer)] py-[18px]"
          >
            <span
              class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-3)] text-center pt-[3px]"
            >
              <a class="text-[var(--ink)] underline hover:no-underline" :href="`/${talk.year}`">
                {{ talk.year }}
              </a>
            </span>
            <div class="flex flex-col gap-y-[8px]">
              <a
                class="text-[16px] text-[var(--ink)] no-underline group flex flex-wrap items-baseline gap-[8px]"
                :href="talk.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  v-if="talk.format === 'panel'"
                  class="relative top-[-1px] inline-flex items-center self-center align-middle [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] border border-[var(--ink)] text-[var(--ink)] px-[5px] py-[1px] leading-[1.15]"
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
                  <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
                </span>
              </a>
              <span
                v-if="talk.coSpeakers.length > 0"
                class="text-[12px] [font-family:var(--font-mono)] text-[var(--ink-3)]"
              >
                w/
                <template
                  v-for="(coSpeakerName, coSpeakerIndex) in talk.coSpeakers"
                  :key="coSpeakerName"
                >
                  <template v-if="coSpeakerIndex > 0">,</template>
                  <a
                    class="text-[var(--ink)] underline hover:no-underline"
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

    <main
      v-else
      class="px-[var(--pad-x)] py-[80px] [font-family:var(--font-mono)] text-[14px] text-[var(--ink-2)]"
    >
      <h1 class="[font-family:var(--font-display)] text-[40px] text-[var(--ink)] m-0">
        Speaker Not Found
      </h1>
      <p>{{ speakerName }}</p>
    </main>

    <AppFooter />
  </div>
</template>
