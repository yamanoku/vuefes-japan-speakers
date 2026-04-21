<script setup lang="ts">
import { useFetchAllSpeakers } from '~/composables/speaker';
import { YEARS } from '~~/types';
import type { AcceptedYear } from '~~/types';

const allSpeakers = await useFetchAllSpeakers();

const { t } = useVfjsI18n();

const view = ref<'chronicle' | 'index'>('chronicle');
const density = ref<'compact' | 'cozy' | 'airy'>('airy');

onMounted(() => {
  const storedView = localStorage.getItem('vfjs:view') as 'chronicle' | 'index' | null;
  if (storedView === 'chronicle' || storedView === 'index') view.value = storedView;
  const storedDensity = localStorage.getItem('vfjs:density') as 'compact' | 'cozy' | 'airy' | null;
  if (storedDensity) density.value = storedDensity;
});

watch(view, (v) => {
  if (import.meta.client) localStorage.setItem('vfjs:view', v);
});
watch(density, (d) => {
  if (import.meta.client) localStorage.setItem('vfjs:density', d);
});

const selectedYear = ref<AcceptedYear | 'all'>('all');
const selectedSpeaker = ref<string>('all');
const query = ref('');

const stats = computed(() => {
  const speakerSet = new Set<string>();
  for (const s of allSpeakers) s.name.forEach((n) => speakerSet.add(n));
  return { speakers: speakerSet.size, talks: allSpeakers.length, years: YEARS.length };
});
</script>

<template>
  <div
    style="
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    "
  >
    <AppChrome current="home" />
    <AppMasthead :stats="stats" />

    <div
      class="flex gap-0 px-[var(--pad-x)] border-b border-[var(--rule)] bg-[var(--paper)]"
      role="tablist"
      aria-label="View mode"
    >
      <button
        role="tab"
        :aria-selected="view === 'chronicle'"
        class="px-[22px] py-[16px] [font-family:var(--font-body)] font-[500] text-[14px] tracking-[-0.005em] border-r border-[var(--rule-soft)] cursor-pointer"
        :class="
          view === 'chronicle'
            ? 'text-[var(--ink)] [box-shadow:inset_0_-2px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'chronicle'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-4)]"
          >A</span
        >
        · {{ t.view_timeline }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          — Chronicle</span
        >
      </button>
      <button
        role="tab"
        :aria-selected="view === 'index'"
        class="px-[22px] py-[16px] [font-family:var(--font-body)] font-[500] text-[14px] tracking-[-0.005em] border-r border-[var(--rule-soft)] cursor-pointer"
        :class="
          view === 'index'
            ? 'text-[var(--ink)] [box-shadow:inset_0_-2px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'index'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-4)]"
          >B</span
        >
        · {{ t.view_index }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          — Directory</span
        >
      </button>
    </div>

    <ChronicleView
      v-if="view === 'chronicle'"
      :all-speakers="allSpeakers"
      :selected-year="selectedYear"
      :selected-speaker="selectedSpeaker"
      :query="query"
      :density="density"
      @update:selected-year="selectedYear = $event"
      @update:selected-speaker="selectedSpeaker = $event"
      @update:query="query = $event"
    />
    <IndexView
      v-else
      :all-speakers="allSpeakers"
      :selected-year="selectedYear"
      :selected-speaker="selectedSpeaker"
      :query="query"
      :density="density"
      @update:selected-year="selectedYear = $event"
      @update:selected-speaker="selectedSpeaker = $event"
      @update:query="query = $event"
    />

    <footer
      class="border-t border-[var(--rule)] grid grid-cols-[1fr_auto] items-end gap-6 px-[var(--pad-x)] py-[40px] [font-family:var(--font-mono)] text-[11px] tracking-[0.05em] text-[var(--ink-3)] uppercase"
    >
      <div>
        Unofficial community archive · Not affiliated with Vue Fes Japan · Source data derived from
        publicly listed sessions.<br />
        <a
          href="#about"
          class="text-[var(--ink-2)] border-b border-[var(--rule-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)]"
          >About this redesign</a
        >
        ·
        <a
          href="https://github.com/yamanoku/vuefes-japan-speakers"
          target="_blank"
          rel="noopener"
          class="text-[var(--ink-2)] border-b border-[var(--rule-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)]"
          >GitHub</a
        >
      </div>
      <div>
        VFJS · {{ stats.speakers }} speakers · {{ stats.talks }} talks · {{ stats.years }} editions
      </div>
    </footer>
  </div>
</template>
