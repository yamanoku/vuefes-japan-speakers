<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
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

type ViewMode = "chronicle" | "index";

const TAB_IDS: Record<ViewMode, string> = {
  chronicle: "tab-chronicle",
  index: "tab-directory",
};

const PANEL_IDS: Record<ViewMode, string> = {
  chronicle: "panel-chronicle",
  index: "panel-directory",
};

const view = ref<ViewMode>("chronicle");
const chronicleTabRef = ref<HTMLButtonElement | null>(null);
const directoryTabRef = ref<HTMLButtonElement | null>(null);

onMounted(() => {
  const storedView = localStorage.getItem("vfjs:view") as ViewMode | null;
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
  for (const speaker of allSpeakers) {
    speaker.name.forEach((name) => speakerSet.add(name));
  }
  return {
    speakers: speakerSet.size,
    talks: allSpeakers.length,
    // 2019年は開催中止のためカウントから除外
    years: YEARS.filter((y) => y !== "2019").length,
  };
});

function focusTab(mode: ViewMode) {
  void nextTick(() => {
    const target = mode === "chronicle" ? chronicleTabRef.value : directoryTabRef.value;
    target?.focus();
  });
}

function showChronicle() {
  view.value = "chronicle";
}

function showDirectory() {
  view.value = "index";
}

function onTabKeydown(event: KeyboardEvent, current: ViewMode) {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    const next: ViewMode = current === "chronicle" ? "index" : "chronicle";
    view.value = next;
    focusTab(next);
    return;
  }
  if (event.key === "Home") {
    event.preventDefault();
    showChronicle();
    focusTab("chronicle");
    return;
  }
  if (event.key === "End") {
    event.preventDefault();
    showDirectory();
    focusTab("index");
  }
}

function updateQuery(value: string) {
  query.value = value;
}

function updateSelectedSpeaker(value: string) {
  selectedSpeaker.value = value;
}

function updateSelectedYear(value: AcceptedYear | "all") {
  selectedYear.value = value;
}
</script>

<template>
  <div>
    <AppHeader />
    <!-- タイトル・統計情報 -->
    <AppMasthead :stats />
    <!-- ビュー切り替えタブバー（Chronicle／Directory） -->
    <div
      class="flex gap-0 px-pad-x border-b border-rule bg-paper"
      role="tablist"
      :aria-label="t.view_mode"
    >
      <!-- 年度別クロニクルビュータブ -->
      <button
        :id="TAB_IDS.chronicle"
        ref="chronicleTabRef"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        :aria-controls="PANEL_IDS.chronicle"
        :aria-selected='view === "chronicle"'
        :tabindex='view === "chronicle" ? 0 : -1'
        :class='view === "chronicle"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showChronicle"
        @keydown='(event) => onTabKeydown(event, "chronicle")'
      >
        {{ t.view_timeline }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Chronicle
        </span>
      </button>
      <!-- スピーカー名索引ディレクトリビュータブ -->
      <button
        :id="TAB_IDS.index"
        ref="directoryTabRef"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        :aria-controls="PANEL_IDS.index"
        :aria-selected='view === "index"'
        :tabindex='view === "index" ? 0 : -1'
        :class='view === "index"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showDirectory"
        @keydown='(event) => onTabKeydown(event, "index")'
      >
        {{ t.view_index }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Directory
        </span>
      </button>
    </div>
    <main id="main">
      <!-- 年度別クロニクルビュー -->
      <div
        :id="PANEL_IDS.chronicle"
        role="tabpanel"
        :aria-labelledby="TAB_IDS.chronicle"
        :hidden='view !== "chronicle"'
      >
        <ChronicleView
          v-if='view === "chronicle"'
          :all-speakers
          :query
          :selected-speaker
          :selected-year
          @update:query="updateQuery"
          @update:selected-speaker="updateSelectedSpeaker"
          @update:selected-year="updateSelectedYear"
        />
      </div>
      <!-- スピーカー索引ディレクトリビュー -->
      <div
        :id="PANEL_IDS.index"
        role="tabpanel"
        :aria-labelledby="TAB_IDS.index"
        :hidden='view !== "index"'
      >
        <DirectoryView
          v-if='view === "index"'
          :all-speakers
          :query
          :selected-speaker
          :selected-year
          @update:query="updateQuery"
          @update:selected-speaker="updateSelectedSpeaker"
          @update:selected-year="updateSelectedYear"
        />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
