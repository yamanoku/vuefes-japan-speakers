<script setup lang="ts">
import { museaStats } from "../../musea/sample-data";

defineArt("./AppMasthead.vue", {
  title: "AppMasthead",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="musea-preview-wide bg-paper text-ink">
      <Self :stats="museaStats" />
    </div>
  </variant>
  <variant name="Dark surface">
    <div class="musea-dark-surface musea-preview-wide bg-paper text-ink">
      <Self :stats="museaStats" />
    </div>
  </variant>
</art>
