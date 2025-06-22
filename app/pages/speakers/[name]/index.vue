<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const route = useRoute();
const { filterNameSpeaker } = await useFetchSpeaker(route.params.name as string);

useHead({
  title: route.params.name as string,
});

useSeoMeta({
  robots: () => {
    if (!filterNameSpeaker.value || filterNameSpeaker.value.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1 class="font-semibold text-3xl text-gray-900 dark:text-white leading-tight">
      {{ $route.params.name }}
    </h1>
    <template v-if="filterNameSpeaker && filterNameSpeaker.length > 0">
      <div class="pt-6">
        <nuxt-link to="/" class="text-gray-500 dark:text-gray-400 text-xl underline hover:no-underline">
          TOPページに戻る
        </nuxt-link>
      </div>
      <div class="pt-6">
        <SpeakerTable :speakers="filterNameSpeaker" />
      </div>
    </template>
    <template v-else>
      <p>Page not found</p>
      <nuxt-link to="/">
        TOP
      </nuxt-link>
    </template>
  </div>
</template>
