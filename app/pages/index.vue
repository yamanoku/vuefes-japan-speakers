<script setup lang="ts">
import { useFetchAllSpeakers } from '~/composables/speaker';
import { YEARS } from '~~/types';
import type { AcceptedYear } from '~~/types';

const { data: allSpeakers } = await useFetchAllSpeakers();

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
  const list = allSpeakers.value;
  const speakerSet = new Set<string>();
  for (const s of list) s.name.forEach((n) => speakerSet.add(n));
  return { speakers: speakerSet.size, talks: list.length, years: YEARS.length };
});
</script>

<template>
  <div>
    <AppHeader />
    <AppMasthead :stats="stats" />
    <div
      aria-label="View mode"
      class="flex gap-0 px-[var(--pad-x)] border-b border-[var(--rule)] bg-[var(--paper)]"
      role="tablist"
    >
      <button
        class="px-[22px] py-[16px] [font-family:var(--font-body)] font-[500] text-[14px] tracking-[-0.005em] border-r border-[var(--rule-soft)] cursor-pointer"
        role="tab"
        :aria-selected="view === 'chronicle'"
        :class="
          view === 'chronicle'
            ? 'text-[var(--ink)] [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'chronicle'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-3)]">
          A
        </span>
        · {{ t.view_timeline }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          — Chronicle
        </span>
      </button>
      <button
        class="px-[22px] py-[16px] [font-family:var(--font-body)] font-[500] text-[14px] tracking-[-0.005em] border-r border-[var(--rule-soft)] cursor-pointer"
        role="tab"
        :aria-selected="view === 'index'"
        :class="
          view === 'index'
            ? 'text-[var(--ink)] [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'index'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-3)]">
          B
        </span>
        · {{ t.view_index }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          — Directory
        </span>
      </button>
    </div>
    <ChronicleView
      v-if="view === 'chronicle'"
      :all-speakers="allSpeakers"
      :density="density"
      :query="query"
      :selected-speaker="selectedSpeaker"
      :selected-year="selectedYear"
      @update:query="query = $event"
      @update:selected-speaker="selectedSpeaker = $event"
      @update:selected-year="selectedYear = $event"
    />
    <DirectoryView
      v-else
      :all-speakers="allSpeakers"
      :density="density"
      :query="query"
      :selected-speaker="selectedSpeaker"
      :selected-year="selectedYear"
      @update:query="query = $event"
      @update:selected-speaker="selectedSpeaker = $event"
      @update:selected-year="selectedYear = $event"
    />
    <AppFooter />
  </div>
</template>
