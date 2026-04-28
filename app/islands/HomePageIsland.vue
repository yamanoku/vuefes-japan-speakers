<script setup vapor lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { YEARS } from "../../types";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import AppMasthead from "../components/AppMasthead.vue";
import ChronicleView from "../components/ChronicleView.vue";
import DirectoryView from "../components/DirectoryView.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { allSpeakers } = defineProps<{
  allSpeakers: SpeakerWithYear[];
}>();

const { t } = useVfjsI18n();

const view = ref<"chronicle" | "index">("chronicle");

onMounted(() => {
  const storedView = localStorage.getItem("vfjs:view") as "chronicle" | "index" | null;
  if (storedView === "chronicle" || storedView === "index") view.value = storedView;
});

watch(view, (value) => {
  if (typeof window !== "undefined") localStorage.setItem("vfjs:view", value);
});

const selectedYear = ref<AcceptedYear | "all">("all");
const selectedSpeaker = ref<string>("all");
const query = ref("");

function updateSelectedYear(value: AcceptedYear | "all") {
  selectedYear.value = value;
}

function updateSelectedSpeaker(value: string) {
  selectedSpeaker.value = value;
}

function updateQuery(value: string) {
  query.value = value;
}

const stats = computed(() => {
  const speakerSet = new Set<string>();
  for (const speaker of allSpeakers) {
    speaker.name.forEach((name) => speakerSet.add(name));
  }
  return {
    speakers: speakerSet.size,
    talks: allSpeakers.length,
    years: YEARS.length,
  };
});
</script>

<template>
  <div>
    <div class="contents">
      <AppHeader />
    </div>

    <!-- タイトル・統計情報 -->
    <div class="contents">
      <AppMasthead :stats="stats" />
    </div>

    <!-- ビュー切り替えタブバー（Chronicle／Directory） -->
    <div
      class="flex gap-0 px-pad-x border-b border-rule bg-paper"
      role="tablist"
      aria-label="View mode"
    >
      <!-- 年度別クロニクルビュータブ -->
      <button
        role="tab"
        :aria-selected="view === 'chronicle'"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        :class="
          view === 'chronicle'
            ? 'text-ink [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-ink-3 hover:text-ink'
        "
        @click="view = 'chronicle'"
      >
        {{ t.view_timeline }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1">Chronicle</span>
      </button>
      <!-- スピーカー名索引ディレクトリビュータブ -->
      <button
        role="tab"
        :aria-selected="view === 'index'"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        :class="
          view === 'index'
            ? 'text-ink [box-shadow:inset_0_-4px_0_var(--accent)]'
            : 'text-ink-3 hover:text-ink'
        "
        @click="view = 'index'"
      >
        {{ t.view_index }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1">Directory</span>
      </button>
    </div>

    <!-- 選択中のビューに応じてコンポーネントを切り替え -->
    <!-- 年度別クロニクルビュー -->
    <div v-if="view === 'chronicle'" class="contents">
      <ChronicleView
        :all-speakers="$props.allSpeakers"
        :selected-year="selectedYear"
        :selected-speaker="selectedSpeaker"
        :query="query"
        @update:selected-year="updateSelectedYear"
        @update:selected-speaker="updateSelectedSpeaker"
        @update:query="updateQuery"
      />
    </div>
    <!-- スピーカー索引ディレクトリビュー -->
    <div v-else class="contents">
      <DirectoryView
        :all-speakers="$props.allSpeakers"
        :selected-year="selectedYear"
        :selected-speaker="selectedSpeaker"
        :query="query"
        @update:selected-year="updateSelectedYear"
        @update:selected-speaker="updateSelectedSpeaker"
        @update:query="updateQuery"
      />
    </div>

    <div class="contents">
      <AppFooter />
    </div>
  </div>
</template>
