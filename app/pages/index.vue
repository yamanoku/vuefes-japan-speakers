<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const { allSpeakers } = await useFetchSpeaker();
</script>

<template>
  <div>
    <h1>Vue Fes Japan Speakers</h1>
    <SpeakerTable :speakers="allSpeakers" />
  </div>
</template>
