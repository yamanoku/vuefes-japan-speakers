<script setup lang="ts">
import { compareLexicalJa } from '~/utils/stringCollate';
import { YEARS } from '~~/types';
import type { SpeakerWithYear, AcceptedYear } from '~~/types';

const props = defineProps<{
  allSpeakers: SpeakerWithYear[];
  selectedYear: AcceptedYear | 'all';
  selectedSpeaker: string;
  query: string;
}>();

const emit = defineEmits<{
  'update:selectedYear': [AcceptedYear | 'all'];
  'update:selectedSpeaker': [string];
  'update:query': [string];
}>();

const { t, lang } = useVfjsI18n();

const uniqueNames = computed(() => {
  const set = new Set<string>();
  props.allSpeakers.forEach((s) => s.name.forEach((n) => set.add(n)));
  return Array.from(set).sort(compareLexicalJa);
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
</script>

<template>
  <main>
    <section :style="{ '--rowgap': '18px' }">
      <SpeakerFilterBar
        :query="query"
        :selected-speaker="selectedSpeaker"
        @update:query="emit('update:query', $event)"
        @update:selected-speaker="emit('update:selectedSpeaker', $event)"
      >
        <option v-for="n in uniqueNames" :key="n" :value="n">
          {{ n }}
        </option>
      </SpeakerFilterBar>
      <YearFilterBar
        :counts="counts"
        :selected-year="selectedYear"
        @update:selected-year="emit('update:selectedYear', $event)"
       />
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
              aria-hidden="true"
              class="[font-family:var(--font-display)] font-[500] text-[clamp(72px,8vw,160px)] leading-[0.85] tracking-[-0.04em] tabular-nums text-[var(--ink)]"
            >
              {{ year }}
            </span>
            <span class="[font-family:var(--font-mono)] text-[12px] tracking-[0.08em] uppercase text-[var(--ink-3)] mt-[10px]">
              {{ t.year_total_talks(arr.length) }}
            </span>
            <NuxtLink
              class="[font-family:var(--font-mono)] text-[24px] tracking-[0.08em] uppercase text-[var(--ink)] hover:text-[var(--accent)] transition-colors border-b border-current pb-[2px] no-underline mt-[14px]"
              :aria-label="`${year} speakers`"
              :to="`/${year}`"
            >
              →
            </NuxtLink>
          </div>
          <!-- Rows -->
          <ul class="list-none p-0 m-0 border-t border-[var(--rule-soft)]">
            <li
              v-for="(s, i) in arr"
              :key="`${year}-${i}`"
              class="grid grid-cols-[56px_1fr] gap-[16px] py-[var(--rowgap)] border-b border-[var(--rule-softer)] items-start"
            >
              <div
                aria-hidden="true"
                class="[font-family:var(--font-mono)] text-[14px] text-[var(--ink-2)] pt-[3px]"
              >
                <span>
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
              </div>
              <div class="grid grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-[clamp(16px,2vw,32px)] items-baseline max-[700px]:grid-cols-1 max-[700px]:gap-[6px]">
                <!-- Speaker names -->
                <div class="[font-family:var(--font-display)] font-[500] text-[clamp(17px,1.5vw,22px)] tracking-[-0.01em] leading-[1.25]">
                  <template v-for="(n, ni) in s.name" :key="n">
                    <span v-if="ni > 0" aria-hidden="true" class="text-[var(--ink-2)] font-normal">
                      ×
                    </span>
                    <NuxtLink
                      class="text-[var(--ink)] border-b border-[var(--rule-soft)] pb-[1px] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      :to="`/speakers/${encodeURIComponent(n)}`"
                    >
                      <ruby v-if="s.nameRuby?.[ni] && lang === 'ja'" lang="ja">
                        {{ n }}
                        <rt>
                          {{ s.nameRuby[ni] }}
                        </rt>
                      </ruby>
                      <span v-else>
                        {{ lang === 'en' && s.nameEn?.[ni] ? s.nameEn[ni] : n }}
                      </span>
                    </NuxtLink>
                  </template>
                </div>
                <!-- Talk title -->
                <div class="text-[clamp(14px,1.1vw,16px)] text-[var(--ink-2)] leading-[1.5]">
                  <a
                    v-if="s.title"
                    class="text-[var(--ink-2)] no-underline hover:text-[var(--ink)]"
                    rel="noopener noreferrer"
                    target="_blank"
                    :href="s.url"
                  >
                    <span class="hover:underline">
                      {{ s.title }}
                    </span>
                    <span
                      class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] ml-[4px]"
                      :aria-label="t.external"
                    >
                      ↗
                    </span>
                  </a>
                  <span
                    v-else
                    class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] uppercase tracking-[0.06em]"
                  >
                    {{ t.tbd }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ol>
    </section>
  </main>
</template>
