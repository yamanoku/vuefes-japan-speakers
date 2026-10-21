<script setup lang="ts">
import type { SpeakerWithYear } from "../../types";
import { SpeakerPageIsland } from "../island-definitions";

const { found, speakerName, speakers } = defineProps<{
  found: boolean;
  speakerName: string;
  speakers: SpeakerWithYear[];
}>();

defineOptions({
  name: "SpeakerRoute",
});
</script>

<template>
  <SpeakerPageIsland :found :speaker-name :speakers />
</template>
