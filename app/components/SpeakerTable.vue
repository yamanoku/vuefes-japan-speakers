<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { SpeakerInfo } from '~~/types';

const UButton = resolveComponent('UButton');
const UTooltip = resolveComponent('UTooltip');
type SpeakerWithYear = SpeakerInfo & { year: string };

defineProps<{
  speakers?: SpeakerWithYear[];
  year?: string;
}>();

const expanded = ref<Record<string, boolean>>({});

const columns = computed<TableColumn<SpeakerWithYear>[]>(() => {
  const expandedColumn: TableColumn<SpeakerWithYear>[] = [
    {
      id: 'expand',
      cell: ({ row }) =>
        h(UTooltip, {
          text: '発表タイトル名',
        }, {
          default: () => h(UButton, {
            'color': 'neutral',
            'variant': 'ghost',
            'icon': 'i-lucide-chevron-down',
            'square': true,
            'aria-label': 'Expand',
            'ui': {
              leadingIcon: [
                'transition-transform',
                row.getIsExpanded() ? 'duration-200 rotate-180' : '',
              ],
            },
            'onClick': () => row.toggleExpanded(),
          }),
        }),
    },
  ];

  return [
    ...expandedColumn,
    {
      accessorKey: 'year',
      header: '年度',
    },
    {
      accessorKey: 'name',
      header: '発表者',
    },
  ];
});
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-md not-prose bg-white dark:bg-gray-900 overflow-hidden">
    <UTable
      v-model:expanded="expanded"
      :columns="columns"
      :data="speakers"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
      class="flex-1"
    >
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
      <template #expanded="{ row }">
        <div class="flex items-start gap-2">
          <a :href="row.original.url" class="text-sm underline hover:no-underline" target="_blank">
            {{ row.original.title ? row.original.title : 'TBD' }}
            <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.15rem]" />
          </a>
        </div>
      </template>
      <template #empty>
        <div class="p-6 flex justify-center content-center">
          <p>Page Not Found</p>
        </div>
      </template>
    </UTable>
  </div>
</template>
