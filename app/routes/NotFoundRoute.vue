<script setup lang="ts">
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <div>
    <AppHeader />

    <main
      class="min-h-[60vh] px-[var(--pad-x)] py-[clamp(64px,10vw,140px)] border-b border-[var(--rule)]"
    >
      <p
        class="[font-family:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--ink-3)] mb-[18px]"
      >
        404
      </p>
      <h1
        class="[font-family:var(--font-display)] text-[clamp(40px,7vw,96px)] font-[500] leading-[0.98] text-[var(--ink)] m-0"
      >
        {{ t.not_found_title }}
      </h1>
      <p
        class="max-w-[560px] text-[clamp(15px,1.4vw,18px)] text-[var(--ink-2)] leading-[1.7] mt-[24px] mb-0"
      >
        {{ t.not_found_description }}
      </p>
      <a
        href="/"
        class="inline-block mt-[32px] [font-family:var(--font-mono)] text-[13px] text-[var(--ink)] underline hover:no-underline"
      >
        {{ t.back_top }}
      </a>
    </main>

    <AppFooter />
  </div>
</template>
