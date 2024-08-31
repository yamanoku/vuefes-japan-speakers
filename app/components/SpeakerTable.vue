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
      <tr v-for="speaker in speakers" :key="speaker.year">
        <td>
          <nuxt-link :to="`/${speaker.year}`">
            {{ speaker.year }}
          </nuxt-link>
        </td>
        <td>
          <div v-for="name in speaker.name" :key="name">
            <nuxt-link :to="`/speakers/${name}`">
              {{ name }}
            </nuxt-link>
          </div>
        </td>
        <td>
          <a :href="speaker.url">{{ speaker.title || "TBD" }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
