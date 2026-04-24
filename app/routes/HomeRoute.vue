<template>
  <HomePageIsland :all-speakers="allSpeakers" />
</template>

<script setup lang="ts">
import type { SpeakerWithYear } from "~~/types";
import { HomePageIsland } from "../island-definitions";

defineOptions({
  name: "HomeRoute",
});

defineProps<{
  allSpeakers: SpeakerWithYear[];
}>();
</script>
