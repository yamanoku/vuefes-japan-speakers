<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchAllSpeakers } from '~/composables/speaker';

// Fetch all speakers with year information
const allSpeakers = await useFetchAllSpeakers();
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
      <SpeakerTable :speakers="allSpeakers || []" />
    </div>
  </div>
</template>
