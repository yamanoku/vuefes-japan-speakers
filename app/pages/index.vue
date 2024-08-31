<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';

const { data: speakers } = await useFetch('/api/speakers');
</script>

<template>
  <div>
    <h1>Vue Fes Japan Speakers</h1>
    <SpeakerTable :speakers="speakers" />
  </div>
</template>
