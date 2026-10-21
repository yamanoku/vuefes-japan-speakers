<script setup lang="ts">
import type { SpeakerInfo } from "../../types";
import { YearPageIsland } from "../island-definitions";

const { found, speakers, year } = defineProps<{
  found: boolean;
  speakers: SpeakerInfo[];
  year: string;
}>();

defineOptions({
  name: "YearRoute",
});
</script>

<template>
  <YearPageIsland :found :speakers :year />
</template>
