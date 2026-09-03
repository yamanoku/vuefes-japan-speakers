<script setup lang="ts">
import { useId } from "vue";
import { YEARS } from "../../types";
import type { AcceptedYear } from "../../types";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { selectedYear, counts } = defineProps<{
  selectedYear: AcceptedYear | "all";
  counts: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: "update:selectedYear", value: AcceptedYear | "all"): void;
}>();

const { t } = useVfjsI18n();
const yearFilterLabelId = useId();

function selectAllYears() {
  emit("update:selectedYear", "all");
}

function selectYear(year: AcceptedYear) {
  emit("update:selectedYear", year);
}
</script>

<template>
  <div class="px-pad-x py-3.5 border-b border-rule-soft" role="region" :aria-label="t.filter_year">
    <!-- 年度選択ボタングループ -->
    <div class="flex items-center flex-wrap gap-1.5">
      <span :id="yearFilterLabelId" class="font-mono text-[12px] tracking-[0.1em] text-ink mr-3">
        {{ t.filter_year }}
      </span>
      <!-- group の名前は可視ラベルを参照する（region の aria-label と重複させない） -->
      <div class="flex gap-1.5 flex-wrap" role="group" :aria-labelledby="yearFilterLabelId">
        <!-- 全年度選択ボタン（スピーカー総数を表示） -->
        <button
          class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] font-mono text-[12px] tracking-[0.02em] border border-rule cursor-pointer transition-colors"
          type="button"
          :aria-pressed='selectedYear === "all" ? "true" : "false"'
          :class='selectedYear === "all"
            ? "bg-ink text-paper border-ink"
            : "text-ink-2 hover:border-ink hover:text-ink"'
          :data-active='selectedYear === "all" ? "true" : "false"'
          @click="selectAllYears"
        >
          ALL · {{ counts.all }}
          <span v-if='selectedYear === "all"' class="sr-only">
            （{{ t.selected }}）
          </span>
        </button>
        <!-- 各開催年ごとの選択ボタン（その年のスピーカー数を表示） -->
        <button
          v-for="y in YEARS"
          :key="y"
          class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] font-mono text-[12px] tracking-[0.02em] border border-rule cursor-pointer transition-colors"
          type="button"
          :aria-pressed='selectedYear === y ? "true" : "false"'
          :class='selectedYear === y
            ? "bg-ink text-paper border-ink"
            : "text-ink-2 hover:border-ink hover:text-ink"'
          :data-active='selectedYear === y ? "true" : "false"'
          @click="() => selectYear(y)"
        >
          {{ y }} · {{ counts[y] }}
          <span v-if="selectedYear === y" class="sr-only">
            （{{ t.selected }}）
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
