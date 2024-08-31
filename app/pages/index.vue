<script setup lang="ts">
const { data: speakers } = await useFetch('/api/speakers');
</script>

<template>
  <div>
    <h1>Vue Fes Japan Speakers</h1>
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
            <nuxt-link :to="speaker.year">
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
  </div>
</template>
