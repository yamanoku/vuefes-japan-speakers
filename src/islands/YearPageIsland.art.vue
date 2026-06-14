<script setup lang="ts">
import { museaYearSpeakers } from "../../musea/sample-data";

defineArt("./YearPageIsland.vue", {
  title: "YearPageIsland",
  category: "Islands",
  status: "ready",
});
</script>

<art>
  <variant name="Found" default>
    <div class="min-h-[680px] bg-paper text-ink">
      <Self found year="2025" :speakers="museaYearSpeakers" />
    </div>
  </variant>
  <variant name="Not found">
    <div class="min-h-[680px] bg-paper text-ink">
      <Self :found="false" year="2020" :speakers="[]" />
    </div>
  </variant>
</art>
