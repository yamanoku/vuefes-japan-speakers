<script setup lang="ts">
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';

const route = useRoute();
const { filterNameSpeaker } = await useFetchSpeaker(route.params.name as string);

if (!filterNameSpeaker?.value || filterNameSpeaker.value.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speaker Not Found',
  });
}

useHead({
  title: `${route.params.name as string} 発表一覧`,
});
</script>

<template>
  <div>
    <h1 class="font-semibold text-3xl text-gray-900 dark:text-white leading-tight">
      {{ $route.params.name }} 発表一覧
    </h1>
    <div class="pt-6">
      <nuxt-link to="/" class="text-gray-500 dark:text-gray-400 text-xl underline hover:no-underline">
        TOPページに戻る
      </nuxt-link>
    </div>
    <div class="pt-6">
      <SpeakerTable :speakers="filterNameSpeaker" />
    </div>
  </div>
</template>
