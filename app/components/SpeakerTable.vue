<script setup lang="ts">
import type { SpeakerInfo } from '~~/types';

defineProps<{
  speakers?: SpeakerInfo[];
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Name</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="speaker in speakers" :key="speaker.name">
        <td>
          <nuxt-link :to="`/${speaker.year}`">
            {{ speaker.year }}
          </nuxt-link>
        </td>
        <td>
          <nuxt-link :to="`/speakers/${speaker.name}`">{{
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
