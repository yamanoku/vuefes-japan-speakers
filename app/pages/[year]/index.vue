<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const route = useRoute();
const { filterYearSpeaker } = await useFetchSpeaker(route.params.year as string);

useHead({
  title: `Vue Fes Japan ${route.params.year as string}`,
});

useSeoMeta({
  robots: () => {
    if (!filterYearSpeaker?.value || filterYearSpeaker.value.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1 class="font-semibold text-3xl text-gray-900 dark:text-white leading-tight">
      Vue Fes Japan {{ $route.params.year }}
    </h1>
    <div class="pt-6">
      <nuxt-link to="/" class="text-gray-500 dark:text-gray-400 text-xl underline hover:no-underline">
        TOPページに戻る
      </nuxt-link>
    </div>
    <div class="pt-6">
      <SpeakerTable :speakers="filterYearSpeaker" :year="route.params.year as string" />
    </div>
  </div>
</template>
