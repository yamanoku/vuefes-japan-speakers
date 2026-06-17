<script setup lang="ts">
import { museaStats } from "../../musea/sample-data";
import { museaDarkSurfaceStyle } from "../../musea/theme";

defineArt("./AppMasthead.vue", {
  title: "AppMasthead",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="bg-paper text-ink">
      <Self :stats="museaStats" />
    </div>
  </variant>
  <variant name="Dark surface">
    <div :style="museaDarkSurfaceStyle" class="bg-paper text-ink">
      <Self :stats="museaStats" />
    </div>
  </variant>
</art>
