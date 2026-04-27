<script setup lang="ts">
import AppFooter from "../components/AppFooter.vue";
import AppHeader from "../components/AppHeader.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { t } = useVfjsI18n();
</script>

<template>
  <div>
    <AppHeader />

    <main class="min-h-[60vh] px-pad-x py-[clamp(64px,10vw,140px)] border-b border-rule">
      <p class="font-mono text-[12px] tracking-[0.12em] uppercase text-ink-3 mb-4.5">404</p>
      <h1 class="font-display text-[clamp(40px,7vw,96px)] font-[500] leading-[0.98] text-ink m-0">
        {{ t.not_found_title }}
      </h1>
      <p class="max-w-[560px] text-[clamp(15px,1.4vw,18px)] text-ink-2 leading-[1.7] mt-6 mb-0">
        {{ t.not_found_description }}
      </p>
      <a
        href="/"
        class="inline-block mt-8 font-mono text-[13px] text-ink underline hover:no-underline"
      >
        {{ t.back_top }}
      </a>
    </main>

    <AppFooter />
  </div>
</template>
