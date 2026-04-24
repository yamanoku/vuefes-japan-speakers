<script setup lang="ts">
defineProps<{
  query: string;
  selectedSpeaker: string;
}>();

const emit = defineEmits<{
  'update:query': [string];
  'update:selectedSpeaker': [string];
}>();

const { t } = useVfjsI18n();

const searchId = useId();
const speakerId = useId();
</script>

<template>
  <div
    class="grid grid-cols-2 gap-[24px] px-[var(--pad-x)] py-[20px] border-b border-[var(--rule-soft)] items-center max-[700px]:grid-cols-1"
  >
    <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
      <label
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--ink)] whitespace-nowrap"
        :for="searchId"
      >
        {{ t.filter_search }}
      </label>
      <input
        class="bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] outline-none focus:border-[var(--accent)] w-full"
        type="search"
        :id="searchId"
        :placeholder="t.filter_search_ph"
        :value="query"
        @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="grid grid-cols-[auto_1fr] gap-[12px] items-center">
      <label
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.1em] text-[var(--ink)] whitespace-nowrap"
        :for="speakerId"
      >
        {{ t.filter_speaker }}
      </label>
      <select
        class="bg-transparent border-0 border-b border-[var(--rule-soft)] px-0 pr-[24px] py-[8px] [font-family:var(--font-body)] text-[15px] text-[var(--ink)] cursor-pointer appearance-none outline-none w-full focus:border-[var(--accent)]"
        :id="speakerId"
        :value="selectedSpeaker"
        @change="emit('update:selectedSpeaker', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">
          {{ t.filter_all_speakers }}
        </option>
        <slot />
      </select>
    </div>
  </div>
</template>
