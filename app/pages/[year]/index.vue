<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const route = useRoute();
const { filterYearSpeaker } = await useFetchSpeaker(route.params.year);

useHead({
  title: route.params.year as string,
});

useSeoMeta({
  robots: () => {
    if (filterYearSpeaker === undefined || filterYearSpeaker?.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1>{{ $route.params.year }}</h1>
    <template v-if="filterYearSpeaker !== undefined && filterYearSpeaker.length > 0">
      <nuxt-link to="/">
        TOP
      </nuxt-link>
      <SpeakerTable :speakers="filterYearSpeaker" />
    </template>
    <template v-else>
      <p>Page not found</p>
      <nuxt-link to="/">
        TOP
      </nuxt-link>
    </template>
  </div>
</template>
