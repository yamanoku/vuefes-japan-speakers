<script setup lang="ts">
import { useId } from "vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { query, selectedSpeaker, speakerOptions } = defineProps<{
  query: string;
  selectedSpeaker: string;
  speakerOptions: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: "update:query", value: string): void;
  (e: "update:selectedSpeaker", value: string): void;
}>();

const { t } = useVfjsI18n();

const searchId = "speaker-filter-search";
const speakerId = "speaker-filter-speaker";
const searchHintId = useId();

function updateQuery(event: Event) {
  emit("update:query", (event.target as HTMLInputElement).value);
}

function updateSelectedSpeaker(event: Event) {
  emit("update:selectedSpeaker", (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div class="flex flex-wrap gap-6 px-pad-x py-5 border-b border-rule-soft items-center">
    <!-- テキスト検索フィールド（検索ランドマーク） -->
    <form
      class="grow-1 basis-[calc((50% - 100%) * 999)] grid grid-cols-[auto_1fr] gap-3 items-center"
      role="search"
      :aria-label="t.filter_search"
      @submit.prevent
    >
      <label
        class="font-mono text-[12px] tracking-[0.1em] text-ink whitespace-nowrap"
        :for="searchId"
      >
        {{ t.filter_search }}
      </label>
      <div class="min-w-0">
        <input
          class="bg-transparent border-0 border-b border-rule px-0 py-[8px] font-body text-[15px] text-ink outline-none focus:border-accent w-full"
          type="search"
          :id="searchId"
          :aria-describedby="searchHintId"
          :placeholder="t.filter_search_ph"
          :value="query"
          @input="updateQuery"
        />
        <p :id="searchHintId" class="sr-only">
          {{ t.filter_search_hint }}
        </p>
      </div>
    </form>
    <!-- スピーカー絞り込みフィールド -->
    <div class="grow-1 basis-[calc((50% - 100%) * 999)] grid grid-cols-[auto_1fr] gap-[12px] items-center">
      <label
        class="font-mono text-[12px] tracking-[0.1em] text-ink whitespace-nowrap"
        :for="speakerId"
      >
        {{ t.filter_speaker }}
      </label>
      <select
        class="bg-transparent border-0 border-b border-rule px-0 pr-6 py-2 font-body text-[15px] text-ink cursor-pointer outline-none w-full focus:border-accent"
        :id="speakerId"
        :value="selectedSpeaker"
        @change="updateSelectedSpeaker"
      >
        <option value="all">
          {{ t.filter_all_speakers }}
        </option>
        <option v-for="option in speakerOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>
