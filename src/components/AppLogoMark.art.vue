<script setup lang="ts">
import { museaDarkSurfaceStyle } from "../../musea/theme";

defineArt("./AppLogoMark.vue", {
  title: "AppLogoMark",
  category: "Components",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="min-h-[160px] flex items-center justify-center bg-paper text-accent">
      <Self class="w-12 h-auto" />
    </div>
  </variant>
  <variant name="Dark surface">
    <div
      :style="museaDarkSurfaceStyle"
      class="min-h-[160px] flex items-center justify-center bg-paper text-accent"
    >
      <Self class="w-12 h-auto" />
    </div>
  </variant>
</art>
