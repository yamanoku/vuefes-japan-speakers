<script setup lang="ts">
import { YEARS } from "../../types";
import type { AcceptedYear } from "../../types";
import { useVfjsI18n } from "../composables/useVfjsI18n";

defineProps<{
  selectedYear: AcceptedYear | "all";
  counts: Record<string, number>;
}>();

const emit = defineEmits<{
  "update:selectedYear": [AcceptedYear | "all"];
}>();

const { t } = useVfjsI18n();
</script>

<template>
  <div
    class="px-[var(--pad-x)] py-[14px] border-b border-[var(--rule-soft)]"
    role="region"
    :aria-label="t.filter_year"
  >
    <!-- 年度選択ボタングループ -->
    <div class="flex items-center flex-wrap gap-[6px]">
      <span
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--ink)] mr-[12px]"
      >
        {{ t.filter_year }}
      </span>
      <div class="flex gap-[6px] flex-wrap" role="group" :aria-label="t.filter_year">
        <!-- 全年度選択ボタン（スピーカー総数を表示） -->
        <button
          class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] [font-family:var(--font-mono)] text-[12px] tracking-[0.02em] border border-[var(--rule-soft)] cursor-pointer transition-colors"
          type="button"
          :class="
            selectedYear === 'all'
              ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
              : 'text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
          "
          :data-active="selectedYear === 'all' ? 'true' : 'false'"
          @click="emit('update:selectedYear', 'all')"
        >
          ALL · {{ counts.all }}
        </button>
        <!-- 各開催年ごとの選択ボタン（その年のスピーカー数を表示） -->
        <button
          v-for="y in YEARS"
          :key="y"
          class="inline-flex items-center justify-center min-w-[48px] px-[8px] py-[3px] [font-family:var(--font-mono)] text-[12px] tracking-[0.02em] border border-[var(--rule-soft)] cursor-pointer transition-colors"
          type="button"
          :class="
            selectedYear === y
              ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
              : 'text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
          "
          :data-active="selectedYear === y ? 'true' : 'false'"
          @click="emit('update:selectedYear', y)"
        >
          {{ y }} · {{ counts[y] }}
        </button>
      </div>
    </div>
  </div>
</template>
