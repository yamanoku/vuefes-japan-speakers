<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <footer
    class="border-t border-[var(--rule)] flex flex-wrap gap-x-[24px] gap-y-[8px] items-baseline justify-between px-[var(--pad-x)] py-[20px] text-[12px] [font-family:var(--font-mono)]"
  >
    <div>
      <a href="/" class="text-inherit underline hover:no-underline hover:text-[var(--ink)]">
        {{ t.back_top }}
      </a>
    </div>
    <div>
      <a
        href="https://github.com/yamanoku/vuefes-japan-speakers"
        target="_blank"
        rel="noopener"
        class="text-inherit no-underline hover:underline hover:text-[var(--ink)]"
      >
        GitHub
      </a>
      <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
    </div>
  </footer>
</template>
