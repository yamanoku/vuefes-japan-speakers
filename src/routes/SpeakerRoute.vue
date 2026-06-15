<script setup lang="ts">
import type { SpeakerWithYear } from "../../types";
import { SpeakerPageIsland } from "../island-definitions";

defineOptions({
  name: "SpeakerRoute",
});

const { found, speakerName, speakers } = defineProps<{
  found: boolean;
  speakerName: string;
  speakers: SpeakerWithYear[];
}>();
</script>

<template>
  <SpeakerPageIsland :found :speaker-name :speakers />
</template>
