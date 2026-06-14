<script setup lang="ts">
import { museaSpeakers } from "../../musea/sample-data";

defineArt("./HomePageIsland.vue", {
  title: "HomePageIsland",
  category: "Islands",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="min-h-[680px] bg-paper text-ink">
      <Self :all-speakers="museaSpeakers" />
    </div>
  </variant>
</art>
