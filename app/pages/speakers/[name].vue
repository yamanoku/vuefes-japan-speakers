<script setup lang="ts">
const route = useRoute();
const { data: speakers } = await useFetch('/api/speakers');
const n = speakers.value?.filter(
  (speaker: { name: string }) => speaker.name === route.params.name,
);

useHead({
  title: route.params.name as string,
});

useSeoMeta({
  robots: () => {
    if (n === undefined || n?.length === 0) {
      return 'noindex';
    }
    return 'index';
  },
});
</script>

<template>
  <div>
    <h1>{{ $route.params.name }}</h1>
    <template v-if="n !== undefined && n.length > 0">
      <nuxt-link to="/">
        TOP
      </nuxt-link>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Name</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="speaker in n" :key="speaker.name">
            <td>
              <nuxt-link :to="'/' + speaker.year">
                {{ speaker.year }}
              </nuxt-link>
            </td>
            <td>
              <nuxt-link :to="'/speakers/' + speaker.name">{{
                speaker.name
              }}</nuxt-link>
            </td>
            <td>
              <a :href="speaker.url">{{ speaker.title || "TBD" }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>Page not found</p>
      <nuxt-link to="/">
        TOP
      </nuxt-link>
    </template>
  </div>
</template>
