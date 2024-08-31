<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const route = useRoute();
const { filterNameSpeaker } = await useFetchSpeaker(route.params.name);
useHead({
  title: route.params.name as string,
});

useSeoMeta({
  robots: () => {
    if (filterNameSpeaker === undefined || filterNameSpeaker.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1>{{ $route.params.name }}</h1>
    <template v-if="filterNameSpeaker !== undefined && filterNameSpeaker.length > 0">
      <nuxt-link to="/">
        TOP
      </nuxt-link>
      <SpeakerTable :speakers="filterNameSpeaker" />
    </template>
    <template v-else>
      <p>Page not found</p>
      <nuxt-link to="/">
        TOP
      </nuxt-link>
    </template>
  </div>
</template>
