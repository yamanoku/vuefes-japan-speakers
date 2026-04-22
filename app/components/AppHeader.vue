<script setup lang="ts">
const { lang, setLang, t } = useVfjsI18n();
</script>

<template>
  <header
    class="border-b border-[var(--rule)] bg-[var(--paper)] sticky top-0 z-20"
    style="backdrop-filter: saturate(1.1)"
    role="banner"
  >
    <div class="grid grid-cols-[1fr_auto] items-center gap-6 py-[14px] px-[var(--pad-x)]">
      <NuxtLink
        to="/"
        class="flex items-baseline gap-[10px] [font-family:var(--font-display)] font-semibold text-[15px] whitespace-nowrap leading-[1.15] text-[var(--ink)] no-underline tracking-[-0.01em]"
        aria-label="Vue Fes Japan Speakers archive — home"
      >
        <span
          class="w-[14px] h-[14px] rounded-full bg-[var(--accent)] inline-block translate-y-[1px] shrink-0"
          aria-hidden="true"
        />
        <span>Vue Fes Japan Speakers</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <div
          class="inline-flex border border-[var(--rule)] [font-family:var(--font-mono)] text-[12px] tracking-[0.08em]"
          role="group"
          :aria-label="t.language"
        >
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer"
            :class="lang === 'ja' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--ink-3)]'"
            :aria-pressed="lang === 'ja' ? 'true' : 'false'"
            @click="setLang('ja')"
          >
            JA
          </button>
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer border-l border-[var(--rule)]"
            :class="lang === 'en' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--ink-3)]'"
            :aria-pressed="lang === 'en' ? 'true' : 'false'"
            @click="setLang('en')"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
