<script setup lang="ts">
import { museaDarkSurfaceStyle } from "../../musea/theme";

defineArt("./AppEventBanner.vue", {
  title: "AppEventBanner",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="min-h-[48px] bg-paper text-ink">
      <Self />
    </div>
  </variant>
  <variant name="Dark surface">
    <div :style="museaDarkSurfaceStyle" class="min-h-[48px] bg-paper text-ink">
      <Self />
    </div>
  </variant>
</art>
