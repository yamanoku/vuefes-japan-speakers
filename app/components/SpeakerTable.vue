<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { SpeakerInfo, AcceptedYear } from '~~/types';
import YearSelector from '~/components/YearSelector.vue';
import SpeakerSelector from '~/components/SpeakerSelector.vue';

const UButton = resolveComponent('UButton');
const UTooltip = resolveComponent('UTooltip');
type SpeakerWithYear = SpeakerInfo & { year: string };

defineProps<{
  speakers?: SpeakerWithYear[];
  year?: string;
  showYearSelector?: boolean;
  selectedYear?: AcceptedYear | 'all';
  showSpeakerSelector?: boolean;
  selectedSpeaker?: string | 'all';
  availableSpeakers?: string[];
}>();

const emit = defineEmits<{
  'update:selectedYear': [value: AcceptedYear | 'all'];
  'update:selectedSpeaker': [value: string | 'all'];
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
      meta: {
        class: {
          td: 'w-full',
        },
      },
    },
  ];
});

const handleYearChange = (value: AcceptedYear | 'all') => {
  emit('update:selectedYear', value);
};

const handleSpeakerChange = (value: string | 'all') => {
  emit('update:selectedSpeaker', value);
};
</script>

<template>
  <div>
    <div class="border border-accented rounded-md not-prose bg-white dark:bg-gray-900 overflow-hidden">
      <div v-if="showYearSelector || showSpeakerSelector" class="border-b border-accented px-4 py-3">
        <div class="flex gap-4">
          <YearSelector
            v-if="showYearSelector"
            :model-value="selectedYear"
            @update:model-value="handleYearChange"
          />
          <SpeakerSelector
            v-if="showSpeakerSelector"
            :model-value="selectedSpeaker"
            :speakers="availableSpeakers"
            @update:model-value="handleSpeakerChange"
          />
        </div>
      </div>
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
  </div>
</template>
