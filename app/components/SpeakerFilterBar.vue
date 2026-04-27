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
  <div class="flex flex-wrap gap-6 px-pad-x py-5 border-b border-rule-soft items-center">
    <!-- テキスト検索フィールド -->
    <div
      class="grow-1 basis-[calc((50% - 100%) * 999)] grid grid-cols-[auto_1fr] gap-3 items-center"
    >
      <label
        class="font-mono text-[12px] tracking-[0.1em] text-ink whitespace-nowrap"
        :for="searchId"
      >
        {{ t.filter_search }}
      </label>
      <input
        :id="searchId"
        type="search"
        class="bg-transparent border-0 border-b border-rule-soft px-0 py-[8px] font-body text-[15px] text-ink outline-none focus:border-accent w-full"
        :placeholder="t.filter_search_ph"
        :value="query"
        @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <!-- スピーカー絞り込みフィールド -->
    <div
      class="grow-1 basis-[calc((50% - 100%) * 999)] grid grid-cols-[auto_1fr] gap-[12px] items-center"
    >
      <label
        class="font-mono text-[12px] tracking-[0.1em] text-ink whitespace-nowrap"
        :for="speakerId"
      >
        {{ t.filter_speaker }}
      </label>
      <select
        :id="speakerId"
        class="bg-transparent border-0 border-b border-rule-soft px-0 pr-6 py-2 font-body text-[15px] text-ink cursor-pointer outline-none w-full focus:border-accent"
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
