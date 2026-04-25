<script setup lang="ts">
import type { SpeakerInfo } from "../../types";
import { YearPageIsland } from "../island-definitions";

defineOptions({
  name: "YearRoute",
});

defineProps<{
  found: boolean;
  speakers: SpeakerInfo[];
  year: string;
}>();
</script>

<template>
  <YearPageIsland :found="found" :speakers="speakers" :year="year" />
</template>
