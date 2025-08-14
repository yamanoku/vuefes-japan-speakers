<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import YearSelector from '~/components/YearSelector.vue';
import { useFetchAllSpeakers, useFilteredSpeakers } from '~/composables/speaker';
import type { AcceptedYear } from '~~/types';

// Fetch all speakers with year information
const allSpeakers = await useFetchAllSpeakers();

// State for selected year
const selectedYear = ref<AcceptedYear | 'all'>('all');

// Filtered speakers based on selected year
const filteredSpeakers = useFilteredSpeakers(ref(allSpeakers), selectedYear);
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
      <YearSelector v-model="selectedYear" />
    </div>
    <div class="pt-6">
      <SpeakerTable :speakers="filteredSpeakers || []" />
    </div>
  </div>
</template>
