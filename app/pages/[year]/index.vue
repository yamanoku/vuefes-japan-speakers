<script setup lang="ts">
const route = useRoute();
const { data: speakers } = await useFetch('/api/speakers');
const s = speakers.value?.filter((speaker: { year: string }) => speaker.year === route.params.year);

useHead({
  title: route.params.year as string,
});

useSeoMeta({
  robots: () => {
    if (s === undefined || s?.length === 0) {
      return 'noindex';
    }
    return 'index';
  }
});
</script>

<template>
  <h1>{{ $route.params.year }}</h1>
  <table v-if="s !== undefined && s.length > 0">
    <thead>
      <tr>
        <th>Year</th>
        <th>Name</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="speaker in s" :key="speaker.name">
        <td><nuxt-link :to="speaker.year">{{ speaker.year }}</nuxt-link></td>
        <td><nuxt-link :to="'/speakers/' + speaker.name">{{ speaker.name }}</nuxt-link></td>
        <td><a :href="speaker.url">{{ speaker.title || 'TBD' }}</a></td>
      </tr>
    </tbody>
  </table>
  <template v-else>
    <p>Page not found</p>
    <nuxt-link to="/">TOP</nuxt-link>
  </template>
</template>