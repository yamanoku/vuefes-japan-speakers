<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { SpeakerInfo } from '~~/types';

type SpeakerWithYear = SpeakerInfo & { year: string };

const props = defineProps<{
  speakers?: SpeakerWithYear[];
  year?: string;
  showYear?: boolean;
}>();

const columns = computed<TableColumn<SpeakerWithYear>[]>(() => {
  const baseColumns: TableColumn<SpeakerWithYear>[] = [
    {
      accessorKey: 'name',
      header: '発表者',
    }, {
      accessorKey: 'title',
      header: '発表セッション名',
    },
  ];

  if (props.showYear) {
    return [
      {
        accessorKey: 'year',
        header: '年度',
      },
      ...baseColumns,
    ];
  }

  return baseColumns;
});
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-md not-prose bg-white dark:bg-gray-900 overflow-hidden">
    <UTable :columns="columns" :data="speakers">
      <template #name-cell="{ row }">
        <div class="flex gap-x-2">
          <UButton
            v-for="name in row.original.name"
            :key="name"
            color="neutral"
            variant="outline"
            :to="`/speakers/${name}`"
          >
            {{ name }}
          </UButton>
        </div>
      </template>
      <template #year-cell="{ row }">
        <UButton color="neutral" variant="outline" :to="`/${row.original.year || year}`">
          {{ row.original.year || year }}
        </UButton>
      </template>
      <template #title-cell="{ row }">
        <a :href="row.original.url" class="underline hover:no-underline" target="_blank">
          {{ row.original.title ? row.original.title : 'TBD' }}
          <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.15rem]" />
        </a>
      </template>
      <template #empty>
        <div class="p-6 flex justify-center content-center">
          <p>Page Not Found</p>
        </div>
      </template>
    </UTable>
  </div>
</template>
