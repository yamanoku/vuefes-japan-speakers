<script setup lang="ts">
import { ref } from "vue";
import { museaSpeakers } from "../musea/sample-data";

defineArt("./DirectoryView.vue", {
  title: "DirectoryView",
  category: "Views",
  status: "ready",
});

const selectedYear = ref("all");
const selectedSpeaker = ref("all");
const query = ref("");
const filteredQuery = ref("Vue");
const emptyQuery = ref("not-found");
</script>

<art>
  <variant name="Default" default>
    <div class="musea-preview-page bg-paper text-ink">
      <Self
        :all-speakers="museaSpeakers"
        :query="query"
        :selected-speaker="selectedSpeaker"
        :selected-year="selectedYear"
        @update:query="query = $event"
        @update:selected-speaker="selectedSpeaker = $event"
        @update:selected-year="selectedYear = $event"
      />
    </div>
  </variant>
  <variant name="Filtered">
    <div class="musea-preview-page bg-paper text-ink">
      <Self
        :all-speakers="museaSpeakers"
        :query="filteredQuery"
        selected-speaker="all"
        selected-year="2025"
        @update:query="filteredQuery = $event"
      />
    </div>
  </variant>
  <variant name="Empty">
    <div class="musea-preview-page bg-paper text-ink">
      <Self
        :all-speakers="museaSpeakers"
        :query="emptyQuery"
        selected-speaker="all"
        selected-year="all"
        @update:query="emptyQuery = $event"
      />
    </div>
  </variant>
</art>
