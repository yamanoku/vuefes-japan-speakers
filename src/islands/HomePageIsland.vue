<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
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

function readViewFromUrl(): "chronicle" | "index" | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("view");
  if (param === "directory" || param === "index") return "index";
  if (param === "chronicle") return "chronicle";
  return null;
}

function writeViewToUrl(value: "chronicle" | "index") {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (value === "index") url.searchParams.set("view", "directory");
  else url.searchParams.delete("view");
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current !== next) window.history.replaceState(window.history.state, "", next);
}

onMounted(() => {
  const fromUrl = readViewFromUrl();
  if (fromUrl) {
    view.value = fromUrl;
    return;
  }
  const storedView = localStorage.getItem("vfjs:view") as "chronicle" | "index" | null;
  if (storedView === "chronicle" || storedView === "index") view.value = storedView;
});

watch(view, (value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("vfjs:view", value);
  writeViewToUrl(value);
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

const tabOrder = ["chronicle", "index"] as const;
type ViewMode = (typeof tabOrder)[number];

const chronicleTabRef = ref<HTMLButtonElement | null>(null);
const directoryTabRef = ref<HTMLButtonElement | null>(null);
const tabChronicleId = useId();
const tabDirectoryId = useId();
const panelChronicleId = useId();
const panelDirectoryId = useId();

function showChronicle() {
  view.value = "chronicle";
}

function showDirectory() {
  view.value = "index";
}

function focusViewTab(next: ViewMode) {
  nextTick(() => {
    (next === "chronicle" ? chronicleTabRef.value : directoryTabRef.value)?.focus();
  });
}

function onTabKeydown(event: KeyboardEvent) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const currentIndex = tabOrder.indexOf(view.value);
  let next: ViewMode;
  if (event.key === "Home") {
    next = tabOrder[0];
  } else if (event.key === "End") {
    next = tabOrder[tabOrder.length - 1];
  } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    next = tabOrder[(currentIndex + 1) % tabOrder.length];
  } else {
    next = tabOrder[(currentIndex - 1 + tabOrder.length) % tabOrder.length];
  }
  view.value = next;
  focusViewTab(next);
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
    <!-- ページ見出しを含む本文（スキップリンク先） -->
    <main id="main" tabindex="-1">
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
          ref="chronicleTabRef"
          class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
          role="tab"
          type="button"
          :id="tabChronicleId"
          :aria-controls="panelChronicleId"
          :aria-selected='view === "chronicle"'
          :tabindex='view === "chronicle" ? 0 : -1'
          :class='view === "chronicle"
            ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
            : "text-ink-3 hover:text-ink"'
          @click="showChronicle"
          @keydown="onTabKeydown"
        >
          {{ t.view_timeline }}
          <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
            Chronicle
          </span>
        </button>
        <!-- スピーカー名索引ディレクトリビュータブ -->
        <button
          ref="directoryTabRef"
          class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
          role="tab"
          type="button"
          :id="tabDirectoryId"
          :aria-controls="panelDirectoryId"
          :aria-selected='view === "index"'
          :tabindex='view === "index" ? 0 : -1'
          :class='view === "index"
            ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
            : "text-ink-3 hover:text-ink"'
          @click="showDirectory"
          @keydown="onTabKeydown"
        >
          {{ t.view_index }}
          <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
            Directory
          </span>
        </button>
      </div>
      <!-- 選択中のビューに応じてコンポーネントを切り替え -->
      <!-- 年度別クロニクルビュー -->
      <div
        v-if='view === "chronicle"'
        role="tabpanel"
        :id="panelChronicleId"
        :aria-labelledby="tabChronicleId"
      >
        <ChronicleView
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
      <div v-else role="tabpanel" :id="panelDirectoryId" :aria-labelledby="tabDirectoryId">
        <DirectoryView
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
