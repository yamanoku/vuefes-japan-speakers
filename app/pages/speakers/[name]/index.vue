<script setup lang="ts">
import { useFetchSpeaker } from '~/composables/speaker';
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
      coSpeakers: s.name.filter((n) => n !== speakerName),
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
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
        class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-bold tracking-[-0.04em] leading-[1] mb-[16px]"
        :lang="hasJapanese(record.name) ? 'ja' : 'en'"
      >
        <ruby v-if="record.nameRuby && lang === 'ja'"
          >{{ record.name }}<rt>{{ record.nameRuby }}</rt></ruby
        >
        <template v-else>{{
          lang === 'en' && record.nameEn ? record.nameEn : record.name
        }}</template>
      </h1>
      <div class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-3)]">
        <div>{{ t.appearance_count(record.talks.length) }}</div>
        <div class="mt-[8px]">
          {{ t.years_appeared }}:
          <template v-for="(year, i) in record.years" :key="year">
            <template v-if="i > 0">, </template>
            <NuxtLink :to="`/${year}`" class="text-[var(--ink)] underline hover:no-underline">{{
              year
            }}</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <section class="px-[var(--pad-x)] py-[40px]">
      <div
        class="[font-family:var(--font-mono)] text-[10px] tracking-[0.1em] text-[var(--ink-3)] mb-[16px]"
      >
        {{ t.related_talks }}
      </div>
      <ol class="list-none p-0 m-0">
        <li
          v-for="(talk, i) in record.talks"
          :key="i"
          class="grid grid-cols-[60px_1fr_auto] gap-x-[16px] items-baseline py-[14px] border-t border-[var(--rule-softer)]"
        >
          <span class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-3)]">
            <NuxtLink
              class="text-[var(--ink)] underline hover:no-underline"
              :to="`/${talk.year}`"
              >{{ talk.year }}</NuxtLink
            >
          </span>
          <a
            class="text-[16px] text-[var(--ink)] no-underline flex items-baseline gap-[4px] hover:text-[var(--accent)]"
            :href="talk.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span :lang="hasJapanese(talk.title || '') ? 'ja' : 'en'">{{
              talk.title || t.tbd
            }}</span>
            <span class="text-[11px] opacity-70" :aria-label="t.external">↗</span>
          </a>
          <span
            v-if="talk.coSpeakers.length > 0"
            class="text-[12px] [font-family:var(--font-mono)] text-[var(--ink-3)]"
          >
            w/
            <template v-for="(cn, ci) in talk.coSpeakers" :key="cn">
              <template v-if="ci > 0">, </template>
              <NuxtLink
                class="text-[var(--accent)] no-underline hover:underline"
                :to="`/speakers/${encodeURIComponent(cn)}`"
                >{{ cn }}</NuxtLink
              >
            </template>
          </span>
        </li>
      </ol>
    </section>

    <AppFooter />
  </div>
</template>
