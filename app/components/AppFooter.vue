<script setup lang="ts">
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <footer
    class="border-t border-rule flex flex-wrap gap-x-6 gap-y-2 items-baseline justify-between px-pad-x py-5 text-[12px] font-mono"
  >
    <!-- トップページへ戻るリンク -->
    <div>
      <a href="/" class="text-inherit underline hover:no-underline hover:text-ink">
        {{ t.back_top }}
      </a>
    </div>
    <!-- GitHubリポジトリへのリンク -->
    <div>
      <a
        href="https://github.com/yamanoku/vuefes-japan-speakers"
        target="_blank"
        rel="noopener"
        class="text-inherit no-underline hover:underline hover:text-ink"
      >
        GitHub
      </a>
      <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
    </div>
  </footer>
</template>
