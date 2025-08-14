<script setup lang="ts">
import type { AcceptedYear } from '~~/types';

type YearSelectorProps = {
  modelValue?: AcceptedYear | 'all';
};

type YearSelectorEmits = {
  (e: 'update:modelValue', value: AcceptedYear | 'all'): void;
};

const props = withDefaults(defineProps<YearSelectorProps>(), {
  modelValue: 'all',
});

const emits = defineEmits<YearSelectorEmits>();

const items = ref([
  { label: '全ての年度', value: 'all' },
  { label: '2018年', value: '2018' },
  { label: '2019年', value: '2019' },
  { label: '2022年', value: '2022' },
  { label: '2023年', value: '2023' },
  { label: '2024年', value: '2024' },
  { label: '2025年', value: '2025' },
]);

const selectedYear = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value as AcceptedYear | 'all'),
});
</script>

<template>
  <div>
    <USelect
      v-model="selectedYear"
      :items="items"
      placeholder="年度を選択してください"
      class="w-48"
    />
  </div>
</template>
