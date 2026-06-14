<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { YEARS } from "../../types";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import AppMasthead from "../components/AppMasthead.vue";
import ChronicleView from "../components/ChronicleView.vue";
import DirectoryView from "../components/DirectoryView.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const props = defineProps<{
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

const stats = computed(() => {
  const speakerSet = new Set<string>();
  for (const speaker of props.allSpeakers) {
    speaker.name.forEach((name) => speakerSet.add(name));
  }
  return {
    speakers: speakerSet.size,
    talks: props.allSpeakers.length,
    // 2019年は開催中止のためカウントから除外
    years: YEARS.filter((y) => y !== "2019").length,
  };
});
</script>

<template>
  <div>
    <AppHeader />
    <!-- タイトル・統計情報 -->
    <AppMasthead :stats="stats" />
    <!-- ビュー切り替えタブバー（Chronicle／Directory） -->
    <div
      aria-label="View mode"
      class="flex gap-0 px-pad-x border-b border-rule bg-paper"
      role="tablist"
    >
      <!-- 年度別クロニクルビュータブ -->
      <button
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        :aria-selected='view === "chronicle"'
        :class='view === "chronicle"
  ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
  : "text-ink-3 hover:text-ink"'
        @click='view = "chronicle"'
      >
        {{ t.view_timeline }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Chronicle
        </span>
      </button>
      <!-- スピーカー名索引ディレクトリビュータブ -->
      <button
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        :aria-selected='view === "index"'
        :class='view === "index"
  ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
  : "text-ink-3 hover:text-ink"'
        @click='view = "index"'
      >
        {{ t.view_index }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Directory
        </span>
      </button>
    </div>
    <!-- 選択中のビューに応じてコンポーネントを切り替え -->
    <!-- 年度別クロニクルビュー -->
    <ChronicleView
      v-if='view === "chronicle"'
      :all-speakers="allSpeakers"
      :query="query"
      :selected-speaker="selectedSpeaker"
      :selected-year="selectedYear"
      @update:query="query = $event"
      @update:selected-speaker="selectedSpeaker = $event"
      @update:selected-year="selectedYear = $event"
    />
    <!-- スピーカー索引ディレクトリビュー -->
    <DirectoryView
      v-else
      :all-speakers="allSpeakers"
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
