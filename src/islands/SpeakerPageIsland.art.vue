<script setup lang="ts">
import { museaSpeakerName, museaSpeakerTalks } from "../../musea/sample-data";

defineArt("./SpeakerPageIsland.vue", {
  title: "SpeakerPageIsland",
  category: "Islands",
  status: "ready",
});
</script>

<art>
  <variant name="Found" default>
    <div class="min-h-[680px] bg-paper text-ink">
      <Self found :speaker-name="museaSpeakerName" :speakers="museaSpeakerTalks" />
    </div>
  </variant>
  <variant name="Not found">
    <div class="min-h-[680px] bg-paper text-ink">
      <Self :found="false" speaker-name="Unknown Speaker" :speakers="[]" />
    </div>
  </variant>
</art>
