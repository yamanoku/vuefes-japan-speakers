<script setup lang="ts">
import { ref } from "vue";
import { museaSpeakers } from "../../musea/sample-data";

defineArt("./ChronicleView.vue", {
  title: "ChronicleView",
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
    <div class="min-h-[680px] bg-paper text-ink">
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
    <div class="min-h-[680px] bg-paper text-ink">
      <Self
        :all-speakers="museaSpeakers"
        :query="filteredQuery"
        :selected-speaker="selectedSpeaker"
        :selected-year="selectedYear"
        @update:query="filteredQuery = $event"
      />
    </div>
  </variant>
  <variant name="Empty">
    <div class="min-h-[680px] bg-paper text-ink">
      <Self
        :all-speakers="museaSpeakers"
        :query="emptyQuery"
        :selected-speaker="selectedSpeaker"
        :selected-year="selectedYear"
        @update:query="emptyQuery = $event"
      />
    </div>
  </variant>
</art>
