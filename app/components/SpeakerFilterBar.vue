<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

defineProps<{
  query: string;
  selectedSpeaker: string;
  speakerOptions: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  "update:query": [string];
  "update:selectedSpeaker": [string];
}>();

const { t } = useVfjsI18n();

const searchId = "speaker-filter-search";
const speakerId = "speaker-filter-speaker";
</script>

<template>
  <div
    class="grid grid-cols-2 gap-[24px] px-[var(--pad-x)] py-[20px] border-b border-[var(--rule-soft)] items-center max-[700px]:grid-cols-1"
  >
    <!-- テキスト検索フィールド -->
    <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
      <label
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--ink)] whitespace-nowrap"
        :for="searchId"
      >
        {{ t.filter_search }}
      </label>
      <input
        :id="searchId"
        type="search"
        class="bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] outline-none focus:border-[var(--accent)] w-full"
        :placeholder="t.filter_search_ph"
        :value="query"
        @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <!-- スピーカー絞り込みフィールド -->
    <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
      <label
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--ink)] whitespace-nowrap"
        :for="speakerId"
      >
        {{ t.filter_speaker }}
      </label>
      <select
        :id="speakerId"
        class="bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 pr-[24px] py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] cursor-pointer appearance-none outline-none w-full focus:border-[var(--accent)]"
        :value="selectedSpeaker"
        @change="emit('update:selectedSpeaker', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">{{ t.filter_all_speakers }}</option>
        <option v-for="option in speakerOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>
