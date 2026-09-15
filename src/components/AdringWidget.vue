<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
const containerRef = ref<HTMLDivElement | null>(null);
let container: HTMLDivElement | null = null;

onMounted(() => {
  if (import.meta.env.MODE === "test") return;
  container = containerRef.value;
  if (!container) return;
  const script = document.createElement("script");
  script.src = "https://ar-cdn.net/widget/v1.js";
  script.async = true;
  script.dataset.siteId = "1b610e8f-1ce4-4957-8bed-76fe0249b460";
  script.dataset.variant = "banner";
  container.append(script);
});

onUnmounted(() => container?.replaceChildren());
</script>

<template>
  <!-- Adring native 枠。未配信時は枠ごと非表示にする -->
  <aside
    class="border-t border-rule px-pad-x py-8 [&:not(:has([data-adring-widget]))]:hidden [&:has([data-adring-state=empty])]:hidden [&:has([data-adring-state=error])]:hidden"
    :aria-label="t.ad_label"
  >
    <p class="font-mono text-[11px] tracking-[0.12em] text-ink-3 mb-4">
      {{ t.ad_label }}
    </p>
    <div ref="containerRef" class="w-full"></div>
  </aside>
</template>
