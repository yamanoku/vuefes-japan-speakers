<script setup lang="ts">
defineArt("./AppFooter.vue", {
  title: "AppFooter",
  category: "Layout",
  status: "ready",
});
</script>

<art>
  <variant name="Default" default>
    <div class="musea-preview-wide bg-paper text-ink">
      <Self />
    </div>
  </variant>
  <variant name="Dark surface">
    <div class="musea-dark-surface musea-preview-wide bg-paper text-ink">
      <Self />
    </div>
  </variant>
</art>
