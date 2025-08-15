<script setup lang="ts">
import type { AcceptedYear, SpeakerInfo } from '~~/types';
import SpeakerTable from '~/components/SpeakerTable.vue';
import { useFetchSpeaker } from '~/composables/speaker';
import { isValidYear } from '~/utils/years';

type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };

const route = useRoute();
const { filterYearSpeaker } = await useFetchSpeaker(route.params.year as string);

const isAcceptedYear = (): boolean => {
  return isValidYear(route.params.year as string);
};

if (!isAcceptedYear()) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  });
}

const speakersWithYear = computed<SpeakerWithYear[] | undefined>(() => {
  if (!filterYearSpeaker?.value) return undefined;
  return filterYearSpeaker.value.map(speaker => ({
    ...speaker,
    year: route.params.year as AcceptedYear,
  }));
});

useHead({
  title: `Vue Fes Japan ${route.params.year as string}`,
});
</script>

<template>
  <div>
    <hgroup>
      <h1 class="font-semibold text-3xl text-gray-900 dark:text-white leading-tight">
        Vue Fes Japan {{ $route.params.year }}
      </h1>
      <p class="pt-6">
        <a
          :href="`https://vuefes.jp/${$route.params.year}/`"
          target="_blank"
          class="text-gray-500 dark:text-gray-400 text-xl underline hover:no-underline"
        >
          Vue Fes Japan {{ $route.params.year }}公式サイト
          <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.15rem]" />
        </a>
      </p>
    </hgroup>
    <div class="pt-6">
      <nuxt-link to="/" class="text-gray-500 dark:text-gray-400 text-xl underline hover:no-underline">
        TOPページに戻る
      </nuxt-link>
    </div>
    <div class="pt-6">
      <SpeakerTable :speakers="speakersWithYear" :year="route.params.year as string" />
    </div>
  </div>
</template>
