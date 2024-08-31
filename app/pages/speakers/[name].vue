<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';

const route = useRoute();
const { data: speakers } = await useFetch('/api/speakers');
const filterSpeaker = speakers.value?.filter(
  (speaker: { name: string }) => speaker.name === route.params.name,
);

useHead({
  title: route.params.name as string,
});

useSeoMeta({
  robots: () => {
    if (filterSpeaker === undefined || filterSpeaker?.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1>{{ $route.params.name }}</h1>
    <template v-if="filterSpeaker !== undefined && filterSpeaker.length > 0">
      <nuxt-link to="/">
        TOP
      </nuxt-link>
      <SpeakerTable :speakers="filterSpeaker" />
    </template>
    <template v-else>
      <p>Page not found</p>
      <nuxt-link to="/">
        TOP
      </nuxt-link>
    </template>
  </div>
</template>
