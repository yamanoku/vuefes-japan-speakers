<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { YEARS } from "../../types";
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import AppMasthead from "../components/AppMasthead.vue";
import ChronicleView from "../components/ChronicleView.vue";
import DirectoryView from "../components/DirectoryView.vue";
import SkipLinks from "../components/SkipLinks.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { allSpeakers } = defineProps<{
  allSpeakers: SpeakerWithYear[];
}>();

const { t } = useVfjsI18n();

const view = ref<"chronicle" | "index">("chronicle");
const tabChronicle = ref<HTMLButtonElement | null>(null);
const tabDirectory = ref<HTMLButtonElement | null>(null);

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

const skipExtra = computed(() =>
  view.value === "chronicle"
    ? [
        { href: "#year-list", label: t.value.skip_to_years },
        { href: "#site-footer", label: t.value.skip_to_footer },
      ]
    : [
        { href: "#directory-list", label: t.value.skip_to_directory },
        { href: "#site-footer", label: t.value.skip_to_footer },
      ],
);

function showChronicle() {
  view.value = "chronicle";
}

function showDirectory() {
  view.value = "index";
}

function focusTab(next: "chronicle" | "index") {
  const el = next === "chronicle" ? tabChronicle.value : tabDirectory.value;
  el?.focus();
}

function onTabKeydown(event: KeyboardEvent) {
  const order = ["chronicle", "index"] as const;
  const current = order.indexOf(view.value);
  let next = current;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    next = (current + 1) % order.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    next = (current - 1 + order.length) % order.length;
  } else if (event.key === "Home") {
    next = 0;
  } else if (event.key === "End") {
    next = order.length - 1;
  } else {
    return;
  }
  event.preventDefault();
  const nextView = order[next]!;
  view.value = nextView;
  nextTick(() => {
    focusTab(nextView);
  });
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
    <SkipLinks :extra="skipExtra" />
    <AppHeader />
    <!-- タイトル・統計情報 -->
    <AppMasthead :stats />
    <!-- ビュー切り替えタブバー（Chronicle／Directory） -->
    <div
      class="flex gap-0 px-pad-x border-b border-rule bg-paper"
      role="tablist"
      :aria-label="t.view_mode"
      @keydown="onTabKeydown"
    >
      <!-- 年度別クロニクルビュータブ -->
      <button
        id="tab-chronicle"
        ref="tabChronicle"
        aria-controls="panel-chronicle"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        :aria-selected='view === "chronicle"'
        :tabindex='view === "chronicle" ? 0 : -1'
        :class='view === "chronicle"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showChronicle"
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
        aria-controls="panel-directory"
        class="px-[22px] py-4 font-body font-[500] text-[14px] tracking-[-0.005em] border-r border-rule-soft cursor-pointer"
        role="tab"
        type="button"
        :aria-selected='view === "index"'
        :tabindex='view === "index" ? 0 : -1'
        :class='view === "index"
          ? "text-ink [box-shadow:inset_0_-4px_0_var(--accent)]"
          : "text-ink-3 hover:text-ink"'
        @click="showDirectory"
      >
        {{ t.view_index }}
        <span class="font-mono text-[12px] tracking-[0.02em] ml-1" lang="en">
          Directory
        </span>
      </button>
    </div>
    <main id="main">
      <!-- 年度別クロニクルビュー -->
      <ChronicleView
        v-if='view === "chronicle"'
        id="panel-chronicle"
        aria-labelledby="tab-chronicle"
        role="tabpanel"
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
        id="panel-directory"
        aria-labelledby="tab-directory"
        role="tabpanel"
        :all-speakers
        :query
        :selected-speaker
        :selected-year
        @update:query="updateQuery"
        @update:selected-speaker="updateSelectedSpeaker"
        @update:selected-year="updateSelectedYear"
      />
    </main>
    <AppFooter />
  </div>
</template>
