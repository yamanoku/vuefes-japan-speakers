<script setup lang="ts">
const { t } = useVfjsI18n();
</script>

<template>
  <footer class="border-t border-[var(--rule)] flex flex-wrap gap-x-[24px] gap-y-[8px] items-baseline justify-between px-[var(--pad-x)] py-[20px] text-[12px] text-[var(--ink-3)] [font-family:var(--font-mono)]">
    <div>
      <NuxtLink class="text-inherit underline hover:no-underline hover:text-[var(--ink-3)]" to="/">
        {{ t.back_top }}
      </NuxtLink>
    </div>
    <div>
      <a
        class="text-inherit underline hover:no-underline hover:text-[var(--ink-3)]"
        href="https://github.com/yamanoku/vuefes-japan-speakers"
        rel="noopener"
        target="_blank"
      >
        GitHub
      </a>
    </div>
  </footer>
</template>
