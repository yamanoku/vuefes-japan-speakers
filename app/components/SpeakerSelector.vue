<script setup lang="ts">
type SpeakerSelectorProps = {
  modelValue?: string | 'all';
  speakers?: string[];
};

type SpeakerSelectorEmits = {
  (e: 'update:modelValue', value: string | 'all'): void;
};

const props = withDefaults(defineProps<SpeakerSelectorProps>(), {
  modelValue: 'all',
  speakers: () => [],
});

const emits = defineEmits<SpeakerSelectorEmits>();

const items = computed(() => [
  { label: '全ての発表者', value: 'all' },
  ...props.speakers.map(speaker => ({
    label: speaker,
    value: speaker,
  })),
]);

const selectedSpeaker = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value as string | 'all'),
});
</script>

<template>
  <div>
    <USelect
      v-model="selectedSpeaker"
      :items="items"
      placeholder="発表者を選択してください"
      class="w-48"
    />
  </div>
</template>
