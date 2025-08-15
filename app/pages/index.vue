<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchAllSpeakers } from '~/composables/speaker';
import type { AcceptedYear } from '~~/types';

// Fetch all speakers with year information
const allSpeakers = await useFetchAllSpeakers();

// State for selected year and speaker
const selectedYear = ref<AcceptedYear | 'all'>('all');
const selectedSpeaker = ref<string | 'all'>('all');

// Get unique speaker names from all speakers
const availableSpeakers = computed(() => {
  const speakerNames = new Set<string>();
  allSpeakers.forEach((speaker) => {
    speaker.name.forEach(name => speakerNames.add(name));
  });
  return Array.from(speakerNames).sort();
});

// Filtered speakers based on selected year and speaker
const filteredSpeakers = computed(() => {
  let filtered = [...allSpeakers];

  // Filter by year
  if (selectedYear.value !== 'all') {
    filtered = filtered.filter(speaker => speaker.year === selectedYear.value);
  }

  // Filter by speaker
  if (selectedSpeaker.value !== 'all') {
    filtered = filtered.filter(speaker =>
      speaker.name.includes(selectedSpeaker.value),
    );
  }

  return filtered;
});
</script>

<template>
  <div>
    <h1 class="font-semibold text-3xl text-gray-900 dark:text-white leading-tight">
      Vue Fes Japan Speakers
    </h1>
    <div class="pt-6">
      <p class="text-lg">
        Vue Fes Japan歴代スピーカーまとめページ
      </p>
    </div>
    <div class="pt-6">
      <SpeakerTable
        :speakers="filteredSpeakers || []"
        :show-year-selector="true"
        :selected-year="selectedYear"
        :show-speaker-selector="true"
        :selected-speaker="selectedSpeaker"
        :available-speakers="availableSpeakers"
        @update:selected-year="selectedYear = $event"
        @update:selected-speaker="selectedSpeaker = $event"
      />
    </div>
  </div>
</template>
