<script setup lang="ts">
import { ref } from "vue";
import { museaSpeakerOptions } from "../musea/sample-data";

defineArt("./SpeakerFilterBar.vue", {
  title: "SpeakerFilterBar",
  category: "Filters",
  status: "ready",
});

const query = ref("");
const selectedSpeaker = ref("all");
const filledQuery = ref("Vue");
</script>

<art>
  <variant name="Default" default>
    <div class="musea-preview-compact bg-paper text-ink">
      <Self
        :query="query"
        :selected-speaker="selectedSpeaker"
        :speaker-options="museaSpeakerOptions"
        @update:query="query = $event"
        @update:selected-speaker="selectedSpeaker = $event"
      />
    </div>
  </variant>
  <variant name="With query">
    <div class="musea-preview-compact bg-paper text-ink">
      <Self
        :query="filledQuery"
        selected-speaker="Evan You"
        :speaker-options="museaSpeakerOptions"
        @update:query="filledQuery = $event"
      />
    </div>
  </variant>
</art>
