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

<template>
  <HomePageIsland :all-speakers="allSpeakers" />
</template>
