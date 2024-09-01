<script setup lang="ts">
import type { SpeakerInfo } from '~~/types';

const columns = [{
  key: 'name',
  label: '発表者',
}, {
  key: 'year',
  label: '発表年',
}, {
  key: 'title',
  label: 'セッション名',
}];

defineProps<{
  speakers?: SpeakerInfo[];
}>();
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-md not-prose bg-white dark:bg-gray-900 overflow-hidden">
    <UTable :columns="columns" :rows="speakers">
      <template #name-data="{ row }">
        <UButton
          v-for="name in row.name"
          :key="name"
          color="white"
          variant="solid"
          :to="`/speakers/${name}`"
        >
          {{ name }}
        </UButton>
      </template>
      <template #year-data="{ row }">
        <UButton color="white" variant="solid" :to="`/${row.year}`">
          {{ row.year }}
        </UButton>
      </template>
      <template #title-data="{ row }">
        <a :href="row.url" class="underline hover:no-underline">{{ row.title ? row.title : 'TBD' }}</a>
      </template>
      <template #empty-state>
        <div class="p-6 flex justify-center content-center">
          <p>Page Not Found</p>
        </div>
      </template>
    </UTable>
  </div>
</template>
