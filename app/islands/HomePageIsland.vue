<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "~~/types";
import { YEARS } from "~~/types";
import AppFooter from "~/components/AppFooter.vue";
import AppHeader from "~/components/AppHeader.vue";
import AppMasthead from "~/components/AppMasthead.vue";
import ChronicleView from "~/components/ChronicleView.vue";
import DirectoryView from "~/components/DirectoryView.vue";
import { useVfjsI18n } from "~/composables/useVfjsI18n";

const props = defineProps<{
  allSpeakers: SpeakerWithYear[];
}>();

const { t } = useVfjsI18n();

const view = ref<"chronicle" | "index">("chronicle");
const density = ref<"compact" | "cozy" | "airy">("airy");

onMounted(() => {
  const storedView = localStorage.getItem("vfjs:view") as "chronicle" | "index" | null;
  if (storedView === "chronicle" || storedView === "index") view.value = storedView;
  const storedDensity = localStorage.getItem("vfjs:density") as "compact" | "cozy" | "airy" | null;
  if (storedDensity) density.value = storedDensity;
});

watch(view, (value) => {
  if (typeof window !== "undefined") localStorage.setItem("vfjs:view", value);
});
watch(density, (value) => {
  if (typeof window !== "undefined") localStorage.setItem("vfjs:density", value);
});

const selectedYear = ref<AcceptedYear | "all">("all");
const selectedSpeaker = ref<string>("all");
const query = ref("");

const stats = computed(() => {
  const speakerSet = new Set<string>();
  for (const speaker of props.allSpeakers) {
    speaker.name.forEach((name) => speakerSet.add(name));
  }
  return { speakers: speakerSet.size, talks: props.allSpeakers.length, years: YEARS.length };
});
</script>

<template>
  <div>
    <AppHeader />
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
            ? 'text-[var(--ink)] [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'chronicle'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-3)]"
          >A</span
        >
        - {{ t.view_timeline }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          - Chronicle</span
        >
      </button>
      <button
        role="tab"
        :aria-selected="view === 'index'"
        class="px-[22px] py-[16px] [font-family:var(--font-body)] font-[500] text-[14px] tracking-[-0.005em] border-r border-[var(--rule-soft)] cursor-pointer"
        :class="
          view === 'index'
            ? 'text-[var(--ink)] [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
        "
        @click="view = 'index'"
      >
        <span class="[font-family:var(--font-mono)] font-normal mr-[4px] text-[var(--ink-3)]"
          >B</span
        >
        - {{ t.view_index }}
        <span
          class="[font-family:var(--font-mono)] text-[var(--ink-4)] text-[12px] tracking-[0.02em]"
        >
          - Directory</span
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
    <DirectoryView
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

    <AppFooter />
  </div>
</template>
