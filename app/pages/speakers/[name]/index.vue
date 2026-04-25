<script setup lang="ts">
import { useFetchSpeaker } from '~/composables/speaker';
import { compareLexicalJa } from '~/utils/stringCollate';
import { hasJapanese } from '~/utils/speakerMap';

const route = useRoute();
const speakerName = route.params.name as string;

const { filterNameSpeaker } = await useFetchSpeaker(speakerName);

if (!filterNameSpeaker?.value || filterNameSpeaker.value.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speaker Not Found',
  });
}

const { t, lang } = useVfjsI18n();

const record = computed(() => {
  const speakers = filterNameSpeaker?.value ?? [];
  let nameRuby: string | undefined;
  let nameEn: string | undefined;
  for (const s of speakers) {
    const idx = s.name.indexOf(speakerName);
    if (idx >= 0) {
      if (!nameRuby && s.nameRuby?.[idx]) nameRuby = s.nameRuby[idx];
      if (!nameEn && s.nameEn?.[idx]) nameEn = s.nameEn[idx];
      if (nameRuby && nameEn) break;
    }
  }
  const talks = speakers
    .map((s) => ({
      year: s.year,
      title: s.title,
      url: s.url,
      format: s.format,
      coSpeakers: s.name.filter((n) => n !== speakerName),
    }))
    .sort((a, b) => compareLexicalJa(a.year, b.year));
  const years = [...new Set(talks.map((tk) => tk.year))].sort();
  return { name: speakerName, nameRuby, nameEn, years, talks };
});

useHead({ title: `${speakerName} 発表一覧` });
</script>

<template>
  <div>
    <AppHeader />

    <header
      class="border-b border-[var(--rule)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-[var(--pad-x)]"
    >
      <h1
        class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-bold leading-[1] mb-[16px]"
        :lang="hasJapanese(record.name) ? 'ja' : 'en'"
      >
        <ruby v-if="record.nameRuby && lang === 'ja'"
          >{{ record.name }}<rt>{{ record.nameRuby }}</rt></ruby
        >
        <template v-else>{{
          lang === 'en' && record.nameEn ? record.nameEn : record.name
        }}</template>
      </h1>
      <div class="[font-family:var(--font-mono)] text-[var(--ink-3)]">
        <div>{{ t.appearance_count(record.talks.length) }}</div>
        <div class="mt-[8px] text-[12px] text-[var(--ink-2)]">
          {{ t.years_appeared }}:
          <template v-for="(year, i) in record.years" :key="year">
            <template v-if="i > 0">, </template>
            <NuxtLink :to="`/${year}`" class="underline hover:no-underline">{{ year }}</NuxtLink>
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
          v-for="(talk, i) in record.talks"
          :key="i"
          class="grid grid-cols-[40px_1fr] gap-x-[16px] items-baseline py-[14px] border-t border-[var(--rule-softer)]"
        >
          <span class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-3)]">
            <NuxtLink
              class="text-[var(--ink)] underline hover:no-underline"
              :to="`/${talk.year}`"
              >{{ talk.year }}</NuxtLink
            >
          </span>
          <div class="flex flex-col gap-y-[8px]">
            <a
              class="text-[16px] text-[var(--ink)] no-underline group flex flex-wrap items-baseline gap-[4px]"
              :href="talk.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                v-if="talk.format === 'panel'"
                class="relative top-[-1px] inline-flex items-center self-center align-middle [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] border border-[var(--ink)] text-[var(--ink)] px-[5px] py-[1px] leading-[1.15]"
                >{{ t.session_format_panel }}</span
              >
              <span>
                <span
                  :lang="hasJapanese(talk.title || '') ? 'ja' : 'en'"
                  class="group-hover:underline"
                  >{{ talk.title || t.tbd }}</span
                >
                <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
              </span>
            </a>
            <span
              v-if="talk.coSpeakers.length > 0"
              class="text-[12px] [font-family:var(--font-mono)] text-[var(--ink-3)]"
            >
              w/
              <template v-for="(cn, ci) in talk.coSpeakers" :key="cn">
                <template v-if="ci > 0">, </template>
                <NuxtLink
                  class="text-[var(--ink)] underline hover:no-underline"
                  :to="`/speakers/${encodeURIComponent(cn)}`"
                  >{{ cn }}</NuxtLink
                >
              </template>
            </span>
          </div>
        </li>
      </ul>
    </section>

    <AppFooter />
  </div>
</template>
