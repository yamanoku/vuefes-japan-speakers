<script setup lang="ts">
import { ref } from "vue";
import { museaYearCounts } from "../../musea/sample-data";

defineArt("./YearFilterBar.vue", {
  title: "YearFilterBar",
  category: "Filters",
  status: "ready",
});

const selectedYear = ref("all");
const selectedYear2025 = ref("2025");
</script>

<art>
  <variant name="All years" default>
    <div class="musea-preview-compact bg-paper text-ink">
      <Self
        :counts="museaYearCounts"
        :selected-year="selectedYear"
        @update:selected-year="selectedYear = $event"
      />
    </div>
  </variant>
  <variant name="Selected year">
    <div class="musea-preview-compact bg-paper text-ink">
      <Self
        :counts="museaYearCounts"
        :selected-year="selectedYear2025"
        @update:selected-year="selectedYear2025 = $event"
      />
    </div>
  </variant>
</art>
