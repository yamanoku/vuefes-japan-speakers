<script setup lang="ts">
import { buildSpeakerMap, hasJapanese } from '~/utils/speakerMap';
import type { SpeakerRecord } from '~/utils/speakerMap';
import { YEARS } from '~~/types';
import type { SpeakerWithYear, AcceptedYear } from '~~/types';

const props = defineProps<{
  allSpeakers: SpeakerWithYear[];
  selectedYear: AcceptedYear | 'all';
  selectedSpeaker: string;
  query: string;
  density: string;
}>();

const emit = defineEmits<{
  'update:selectedYear': [AcceptedYear | 'all'];
  'update:selectedSpeaker': [string];
  'update:query': [string];
}>();

const { t, lang } = useVfjsI18n();

const speakerMap = computed(() => buildSpeakerMap(props.allSpeakers));
const allRecords = computed(() => Array.from(speakerMap.value.values()));

const sort = ref<'name' | 'appearances' | 'latest'>('appearances');

const counts = computed(() => {
  const c: Record<string, number> = { all: allRecords.value.length };
  for (const y of YEARS) {
    c[y] = props.allSpeakers.filter((s) => s.year === y).length;
  }
  return c;
});

const filtered = computed<SpeakerRecord[]>(() => {
  const q = props.query.trim().toLowerCase();
  let list = allRecords.value.filter((rec) => {
    if (props.selectedYear !== 'all' && !rec.years.includes(props.selectedYear)) return false;
    if (props.selectedSpeaker !== 'all' && rec.name !== props.selectedSpeaker) return false;
    if (q) {
      const titles = rec.talks.map((tk) => tk.title || '').join(' ');
      const hay = (rec.name + ' ' + titles).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sort.value === 'appearances') {
    list = [...list].sort(
      (a, b) =>
        b.talks.length - a.talks.length ||
        a.years[0]?.localeCompare(b.years[0] || '') ||
        a.name.localeCompare(b.name),
    );
  } else if (sort.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort.value === 'latest') {
    list = [...list].sort(
      (a, b) =>
        b.years[b.years.length - 1]?.localeCompare(a.years[a.years.length - 1] || '') ||
        a.name.localeCompare(b.name),
    );
  }
  return list;
});

const openRows = ref(new Set<string>());

function toggleRow(name: string) {
  const next = new Set(openRows.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  openRows.value = next;
}

const idxpad = computed(
  () => ({ compact: '8px', cozy: '14px', airy: '22px' })[props.density] ?? '14px',
);
</script>

<template>
  <section :style="{ '--idxpad': idxpad }">
    <!-- Toolbar: search + speaker filter -->
    <div
      class="grid grid-cols-2 gap-[24px] px-[var(--pad-x)] py-[20px] border-b border-[var(--rule-soft)] items-center max-[700px]:grid-cols-1"
    >
      <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
        <label
          class="[font-family:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] whitespace-nowrap"
          for="idx-search"
          >{{ t.filter_search }}</label
        >
        <input
          id="idx-search"
          type="search"
          class="bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] outline-none focus:border-[var(--accent)] w-full"
          :placeholder="t.filter_search_ph"
          :value="query"
          @input="emit('update:query', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
        <label
          class="[font-family:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] whitespace-nowrap"
          for="idx-speaker"
          >{{ t.filter_speaker }}</label
        >
        <select
          id="idx-speaker"
          class="vfjs-select bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 pr-[24px] py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] cursor-pointer appearance-none outline-none w-full focus:border-[var(--accent)]"
          :value="selectedSpeaker"
          @change="emit('update:selectedSpeaker', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">{{ t.filter_all_speakers }}</option>
          <option v-for="r in allRecords" :key="r.name" :value="r.name">
            {{ r.name }} ({{ r.talks.length }})
          </option>
        </select>
      </div>
    </div>

    <!-- Year chips -->
    <div
      class="px-[var(--pad-x)] py-[14px] border-b border-[var(--rule-soft)]"
      role="region"
      :aria-label="t.filter_year"
    >
      <div class="flex items-center flex-wrap gap-[6px]">
        <span
          class="[font-family:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] mr-[12px]"
          >{{ t.filter_year }}</span
        >
        <div class="flex gap-[6px] flex-wrap" role="group" :aria-label="t.filter_year">
          <button
            type="button"
            class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] [font-family:var(--font-mono)] text-[12px] tracking-[0.02em] border border-[var(--rule-soft)] cursor-pointer transition-colors"
            :class="
              selectedYear === 'all'
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
            "
            @click="emit('update:selectedYear', 'all')"
          >
            ALL · {{ counts.all }}
          </button>
          <button
            v-for="y in YEARS"
            :key="y"
            type="button"
            class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] [font-family:var(--font-mono)] text-[12px] tracking-[0.02em] border border-[var(--rule-soft)] cursor-pointer transition-colors"
            :class="
              selectedYear === y
                ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
                : 'text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
            "
            @click="emit('update:selectedYear', y)"
          >
            {{ y }} · {{ counts[y] }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sort header -->
    <div
      class="flex items-center gap-[8px] px-[var(--pad-x)] pt-[18px] pb-[10px] border-b border-[var(--rule-soft)] [font-family:var(--font-mono)]"
    >
      <button
        class="text-[11px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer"
        :class="
          sort === 'name'
            ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
            : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
        "
        @click="sort = 'name'"
      >
        Name A→Z
      </button>
      <button
        class="text-[11px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer"
        :class="
          sort === 'appearances'
            ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
            : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
        "
        @click="sort = 'appearances'"
      >
        Appearances ↓
      </button>
      <button
        class="text-[11px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer"
        :class="
          sort === 'latest'
            ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
            : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
        "
        @click="sort = 'latest'"
      >
        Latest year ↓
      </button>
      <span class="ml-auto text-[11px] tracking-[0.06em] text-[var(--ink-3)]"
        >{{ String(filtered.length).padStart(3, '0') }} /
        {{ String(allRecords.length).padStart(3, '0') }}</span
      >
    </div>

    <div
      v-if="filtered.length === 0"
      class="px-[var(--pad-x)] py-[80px] text-center [font-family:var(--font-mono)] text-[13px] tracking-[0.05em] uppercase text-[var(--ink-3)]"
    >
      {{ t.empty }}
    </div>

    <ol class="list-none p-0 m-0">
      <li
        v-for="(rec, i) in filtered"
        :key="rec.name"
        class="border-b border-[var(--rule-softer)]"
        :data-open="openRows.has(rec.name) ? 'true' : 'false'"
      >
        <button
          class="w-full grid items-center px-[var(--pad-x)] py-[var(--idxpad)] cursor-pointer text-left"
          style="grid-template-columns: 44px minmax(0, 1fr) auto 24px; gap: clamp(12px, 2vw, 28px)"
          :class="openRows.has(rec.name) ? 'bg-[var(--paper-2)]' : ''"
          :aria-expanded="openRows.has(rec.name)"
          @click="toggleRow(rec.name)"
        >
          <span
            class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-4)] tabular-nums"
            aria-hidden="true"
            >{{ String(i + 1).padStart(3, '0') }}</span
          >
          <span
            class="[font-family:var(--font-display)] text-[clamp(15px,1.2vw,18px)] font-[500] tracking-[-0.005em] text-[var(--ink)]"
            :lang="hasJapanese(rec.name) ? 'ja' : 'en'"
          >
            <ruby v-if="rec.nameRuby && lang === 'ja'"
              >{{ rec.name }}<rt>{{ rec.nameRuby }}</rt></ruby
            >
            <template v-else>{{ lang === 'en' && rec.nameEn ? rec.nameEn : rec.name }}</template>
            <span
              v-if="rec.talks.length > 1"
              class="[font-family:var(--font-mono)] bg-[var(--accent)] text-[10px] text-[var(--accent-ink)] ml-[8px] font-normal tracking-[0.02em] align-[2px] border border-[var(--accent)] px-[5px] py-[1px]"
              :aria-label="t.appearance_count(rec.talks.length)"
              >×{{ rec.talks.length }}</span
            >
          </span>
          <span
            class="inline-grid gap-[3px]"
            style="grid-template-columns: repeat(6, 28px)"
            :aria-label="t.years_appeared + ': ' + rec.years.join(', ')"
          >
            <span
              v-for="y in YEARS"
              :key="y"
              class="w-[28px] h-[22px] flex items-center justify-center [font-family:var(--font-mono)] text-[10px] tracking-[0]"
              :class="[
                rec.years.includes(y) && selectedYear === y
                  ? 'bg-[var(--accent)] border border-[var(--accent)] text-white'
                  : rec.years.includes(y)
                    ? 'bg-[var(--ink)] border border-[var(--ink)] text-[var(--paper)]'
                    : 'border border-[var(--rule-softer)] text-[var(--ink-4)]',
              ]"
              :title="y"
              >{{ y.slice(-2) }}</span
            >
          </span>
          <span
            class="[font-family:var(--font-mono)] text-[16px] text-[var(--ink-3)] text-right"
            aria-hidden="true"
            >{{ openRows.has(rec.name) ? '−' : '+' }}</span
          >
        </button>
        <div
          v-if="openRows.has(rec.name)"
          class="bg-[var(--paper-2)] border-t border-[var(--rule-softer)] pt-[8px] pb-[22px] px-[var(--pad-x)]"
          style="padding-left: calc(var(--pad-x) + 44px + clamp(12px, 2vw, 28px))"
        >
          <NuxtLink
            class="[font-family:var(--font-mono)] text-[11px] tracking-[0.06em] uppercase text-[var(--accent)] border-b border-current pb-[1px] no-underline"
            :to="`/speakers/${encodeURIComponent(rec.name)}`"
          >
            {{ t.speaker_profile }} → {{ rec.name }}
          </NuxtLink>
          <ol class="list-none p-0 m-0 mt-[14px]">
            <li
              v-for="(talk, k) in rec.talks"
              :key="k"
              class="grid gap-[16px] items-baseline py-[6px] border-t border-[var(--rule-softer)]"
              style="grid-template-columns: 56px minmax(0, 1fr) auto"
              :class="k === 0 ? 'border-t-0' : ''"
            >
              <span
                class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-3)] tabular-nums"
                >{{ talk.year }}</span
              >
              <a
                class="text-[14px] text-[var(--ink)] pb-[1px] leading-[1.45]"
                :href="talk.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span :lang="hasJapanese(talk.title || '') ? 'ja' : 'en'">{{
                  talk.title || t.tbd
                }}</span>
                <span
                  class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-4)] ml-[4px]"
                  :aria-label="t.external"
                  >↗</span
                >
              </a>
              <span
                v-if="talk.coSpeakers.length > 0"
                class="text-[12px] [font-family:var(--font-mono)] text-[var(--ink-3)]"
              >
                w/
                <template v-for="(cn, ci) in talk.coSpeakers" :key="cn">
                  <template v-if="ci > 0">, </template>
                  <NuxtLink
                    class="text-[var(--ink)] border-b border-[var(--rule-soft)] pb-[1px] no-underline hover:border-[var(--ink)]"
                    :to="`/speakers/${encodeURIComponent(cn)}`"
                    >{{ cn }}</NuxtLink
                  >
                </template>
              </span>
            </li>
          </ol>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.vfjs-select {
  background-image:
    linear-gradient(45deg, transparent 50%, var(--ink-2) 50%),
    linear-gradient(135deg, var(--ink-2) 50%, transparent 50%);
  background-position:
    calc(100% - 10px) 14px,
    calc(100% - 5px) 14px;
  background-size:
    5px 5px,
    5px 5px;
  background-repeat: no-repeat;
}
</style>
