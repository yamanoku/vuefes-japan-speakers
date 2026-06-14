<script setup lang="ts">
defineArt("./AppHeader.vue", {
  title: "AppHeader",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="musea-preview-wide min-h-[96px] bg-paper text-ink">
      <Self />
    </div>
  </variant>
  <variant name="Dark surface">
    <div class="musea-dark-surface musea-preview-wide min-h-[96px] bg-paper text-ink">
      <Self />
    </div>
  </variant>
</art>
