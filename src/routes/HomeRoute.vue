<script setup lang="ts">
import type { SpeakerWithYear } from "../../types";
import { HomePageIsland } from "../island-definitions";

const { allSpeakers } = defineProps<{
  allSpeakers: SpeakerWithYear[];
}>();

defineOptions({
  name: "HomeRoute",
});
</script>

<template>
  <HomePageIsland :all-speakers />
</template>
