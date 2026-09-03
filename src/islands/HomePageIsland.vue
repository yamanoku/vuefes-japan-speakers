<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
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
const views: ViewMode[] = ["chronicle", "index"];

const view = ref<ViewMode>("chronicle");
const tabChronicle = useTemplateRef<HTMLButtonElement>("tabChronicle");
const tabDirectory = useTemplateRef<HTMLButtonElement>("tabDirectory");

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

function showChronicle() {
  view.value = "chronicle";
}

function showDirectory() {
  view.value = "index";
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

function onTabKeydown(event: KeyboardEvent, current: ViewMode) {
  const idx = views.indexOf(current);
  let nextIdx = idx;
  if (event.key === "ArrowRight") nextIdx = (idx + 1) % views.length;
  else if (event.key === "ArrowLeft") nextIdx = (idx - 1 + views.length) % views.length;
  else if (event.key === "Home") nextIdx = 0;
  else if (event.key === "End") nextIdx = views.length - 1;
  else return;

  event.preventDefault();
  view.value = views[nextIdx];
  nextTick(() => {
    if (views[nextIdx] === "chronicle") tabChronicle.value?.focus();
    else tabDirectory.value?.focus();
  });
}

function onChronicleTabKeydown(event: KeyboardEvent) {
  onTabKeydown(event, "chronicle");
}

function onDirectoryTabKeydown(event: KeyboardEvent) {
  onTabKeydown(event, "index");
}

const activeTabId = computed(() => (view.value === "chronicle" ? "tab-chronicle" : "tab-directory"));
</script>

<template>
  <div>
    <!-- スキップリンク（本文へジャンプ） -->
    <a
      class="skip-link"
      href="#main"
    >
      {{ t.skip_to_content }}
    </a>
    <AppHeader />
    <!-- タイトル・統計情報 -->
    <AppMasthead :stats />
    <!-- ビュー切り替えタブバー（Chronicle／Directory） -->
    <!-- @vize:ignore-start -->
    <div
      :aria-label="t.view_mode"
      class="flex gap-0 px-pad-x border-b border-rule bg-paper"
      role="tablist"
    >
      <!-- 年度別クロニクルビュータブ -->
      <button
        id="tab-chronicle"
        ref="tabChronicle"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        aria-controls="main"
        :aria-selected='view === "chronicle"'
        :tabindex='view === "chronicle" ? 0 : -1'
        :class='view === "chronicle"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showChronicle"
        @keydown="onChronicleTabKeydown"
      >
        {{ t.view_timeline }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Chronicle
        </span>
      </button>
      <!-- スピーカー名索引ディレクトリビュータブ -->
      <button
        id="tab-directory"
        ref="tabDirectory"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        aria-controls="main"
        :aria-selected='view === "index"'
        :tabindex='view === "index" ? 0 : -1'
        :class='view === "index"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showDirectory"
        @keydown="onDirectoryTabKeydown"
      >
        {{ t.view_index }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Directory
        </span>
      </button>
    </div>
    <!-- @vize:ignore-end -->
    <!-- 選択中のビューに応じてコンポーネントを切り替え -->
    <!-- @vize:ignore-start -->
    <main
      id="main"
      role="tabpanel"
      :aria-labelledby="activeTabId"
      tabindex="0"
    >
      <!-- 年度別クロニクルビュー -->
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
      <!-- スピーカー索引ディレクトリビュー -->
      <DirectoryView
        v-else
        :all-speakers
        :query
        :selected-speaker
        :selected-year
        @update:query="updateQuery"
        @update:selected-speaker="updateSelectedSpeaker"
        @update:selected-year="updateSelectedYear"
      />
    </main>
    <!-- @vize:ignore-end -->
    <AppFooter />
  </div>
</template>
