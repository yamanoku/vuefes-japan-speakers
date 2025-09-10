<script setup lang="ts">
import type { AcceptedYear } from '~~/types';
import { YEARS } from '~~/types';

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

const items = computed(() => [
  { label: '全ての年度', value: 'all' as const },
  ...YEARS.map(y => ({ label: `${y}年`, value: y })),
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
