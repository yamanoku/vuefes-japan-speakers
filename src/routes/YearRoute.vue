<script setup lang="ts">
import type { SpeakerInfo } from "../../types";
import { YearPageIsland } from "../island-definitions";

defineOptions({
  name: "YearRoute",
});

const { found, speakers, year } = defineProps<{
  found: boolean;
  speakers: SpeakerInfo[];
  year: string;
}>();
</script>

<template>
  <YearPageIsland :found :speakers :year />
</template>
