<script setup lang="ts">
import { museaDarkSurfaceStyle } from "../../musea/theme";

defineArtMeta({
  title: "AppFooter",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="bg-paper text-ink">
      <Self />
    </div>
  </variant>
  <variant name="Dark surface">
    <div :style="museaDarkSurfaceStyle" class="bg-paper text-ink">
      <Self />
    </div>
  </variant>
</art>
