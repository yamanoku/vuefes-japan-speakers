<script setup lang="ts">
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
      class="musea-dark-surface min-h-[160px] flex items-center justify-center bg-paper text-accent"
    >
      <Self class="w-12 h-auto" />
    </div>
  </variant>
</art>
