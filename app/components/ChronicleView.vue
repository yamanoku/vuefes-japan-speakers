<script setup lang="ts">
import { buildSpeakerMap, hasJapanese } from '~/utils/speakerMap';
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

const { t } = useVfjsI18n();

const speakerMap = computed(() => buildSpeakerMap(props.allSpeakers));

const uniqueNames = computed(() => {
  const set = new Set<string>();
  props.allSpeakers.forEach((s) => s.name.forEach((n) => set.add(n)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const counts = computed(() => {
  const c: Record<string, number> = { all: props.allSpeakers.length };
  for (const y of YEARS) {
    c[y] = props.allSpeakers.filter((s) => s.year === y).length;
  }
  return c;
});

const filtered = computed(() => {
  const q = props.query.trim().toLowerCase();
  return props.allSpeakers.filter((s) => {
    if (props.selectedYear !== 'all' && s.year !== props.selectedYear) return false;
    if (props.selectedSpeaker !== 'all' && !s.name.includes(props.selectedSpeaker)) return false;
    if (q) {
      const hay = (s.title || '') + ' ' + s.name.join(' ');
      if (!hay.toLowerCase().includes(q)) return false;
    }
    return true;
  });
});

const grouped = computed(() => {
  const map = new Map<string, SpeakerWithYear[]>();
  for (const y of YEARS) map.set(y, []);
  for (const s of filtered.value) map.get(s.year)?.push(s);
  return Array.from(map.entries()).filter(([, arr]) => arr.length > 0);
});

function getSpeakerCount(name: string): number {
  return speakerMap.value.get(name)?.years.length ?? 1;
}

const rowgap = computed(
  () => ({ compact: '10px', cozy: '18px', airy: '32px' })[props.density] ?? '18px',
);
</script>

<template>
  <section :style="{ '--rowgap': rowgap }">
    <!-- Toolbar: search + speaker filter -->
    <div
      class="grid grid-cols-2 gap-[24px] px-[var(--pad-x)] py-[20px] border-b border-[var(--rule-soft)] items-center max-[700px]:grid-cols-1"
    >
      <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
        <label
          class="[font-family:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase text-[var(--ink-3)] whitespace-nowrap"
          for="chron-search"
          >{{ t.filter_search }}</label
        >
        <input
          id="chron-search"
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
          for="chron-speaker"
          >{{ t.filter_speaker }}</label
        >
        <select
          id="chron-speaker"
          class="vfjs-select bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 pr-[24px] py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] cursor-pointer appearance-none outline-none w-full focus:border-[var(--accent)]"
          :value="selectedSpeaker"
          @change="emit('update:selectedSpeaker', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">{{ t.filter_all_speakers }}</option>
          <option v-for="n in uniqueNames" :key="n" :value="n">{{ n }}</option>
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
            :data-active="selectedYear === 'all' ? 'true' : 'false'"
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
            :data-active="selectedYear === y ? 'true' : 'false'"
            @click="emit('update:selectedYear', y)"
          >
            {{ y }} · {{ counts[y] }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="grouped.length === 0"
      class="px-[var(--pad-x)] py-[80px] text-center [font-family:var(--font-mono)] text-[13px] tracking-[0.05em] uppercase text-[var(--ink-3)]"
    >
      {{ t.empty }}
    </div>

    <ol class="list-none p-0 m-0" :aria-label="t.nav_all_label">
      <li
        v-for="[year, arr] in grouped"
        :key="year"
        class="grid grid-cols-[minmax(200px,260px)_1fr] gap-[clamp(24px,4vw,64px)] border-b border-[var(--rule)] items-start px-[var(--pad-x)] py-[clamp(32px,5vw,72px)] max-[800px]:grid-cols-1 max-[800px]:gap-8"
      >
        <!-- Year label (sticky) -->
        <div
          class="flex flex-col items-start sticky top-[72px] max-[800px]:static"
          :id="`year-${year}`"
        >
          <span
            class="[font-family:var(--font-display)] font-[500] text-[clamp(72px,10vw,160px)] leading-[0.85] tracking-[-0.04em] tabular-nums text-[var(--ink)]"
            aria-hidden="true"
            >{{ year }}</span
          >
          <span
            class="[font-family:var(--font-mono)] text-[11px] tracking-[0.08em] uppercase text-[var(--ink-3)] mt-[10px]"
            >{{ t.year_total_talks(arr.length) }}</span
          >
          <NuxtLink
            class="[font-family:var(--font-mono)] text-[11px] tracking-[0.08em] uppercase text-[var(--accent)] border-b border-current pb-[2px] no-underline mt-[14px]"
            :to="`/${year}`"
            :aria-label="`${year} speakers`"
            >→</NuxtLink
          >
        </div>

        <!-- Rows -->
        <ul class="list-none p-0 m-0 border-t border-[var(--rule-soft)]">
          <li
            v-for="(s, i) in arr"
            :key="`${year}-${i}`"
            class="grid grid-cols-[56px_1fr] gap-[16px] py-[var(--rowgap)] border-b border-[var(--rule-softer)] items-start"
          >
            <div
              class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-4)] pt-[3px]"
              aria-hidden="true"
            >
              <span>{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div
              class="grid grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-[clamp(16px,2vw,32px)] items-baseline max-[700px]:grid-cols-1 max-[700px]:gap-[6px]"
            >
              <!-- Speaker names -->
              <div
                class="[font-family:var(--font-display)] font-[500] text-[clamp(17px,1.5vw,22px)] tracking-[-0.01em] leading-[1.25]"
              >
                <template v-for="(n, ni) in s.name" :key="n">
                  <span v-if="ni > 0" class="text-[var(--ink-4)] font-normal" aria-hidden="true">
                    ×
                  </span>
                  <NuxtLink
                    class="text-[var(--ink)] border-b border-[var(--rule-soft)] pb-[1px] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    :to="`/speakers/${encodeURIComponent(n)}`"
                  >
                    <span>{{ n }}</span>
                    <span
                      v-if="getSpeakerCount(n) > 1"
                      class="[font-family:var(--font-mono)] text-[10px] text-[var(--accent)] ml-[4px] tracking-[0.02em] align-[2px]"
                      :title="t.appearance_count(getSpeakerCount(n))"
                      >×{{ getSpeakerCount(n) }}</span
                    >
                  </NuxtLink>
                </template>
              </div>
              <!-- Talk title -->
              <div class="text-[clamp(14px,1.1vw,16px)] text-[var(--ink-2)] leading-[1.5]">
                <a
                  v-if="s.title"
                  :href="s.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[var(--ink-2)] no-underline hover:text-[var(--ink)]"
                >
                  <span :lang="hasJapanese(s.title) ? 'ja' : 'en'">{{ s.title }}</span>
                  <span
                    class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-4)] ml-[4px]"
                    :aria-label="t.external"
                    >↗</span
                  >
                </a>
                <span
                  v-else
                  class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-4)] uppercase tracking-[0.06em]"
                  >{{ t.tbd }}</span
                >
              </div>
            </div>
          </li>
        </ul>
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
