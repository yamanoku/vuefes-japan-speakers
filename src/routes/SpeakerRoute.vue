<script setup lang="ts">
import type { SpeakerWithYear } from "../../types";
import { SpeakerPageIsland } from "../island-definitions";

defineOptions({
  name: "SpeakerRoute",
});

defineProps<{
  found: boolean;
  speakerName: string;
  speakers: SpeakerWithYear[];
}>();
</script>

<template>
  <SpeakerPageIsland :found :speaker-name :speakers />
</template>
