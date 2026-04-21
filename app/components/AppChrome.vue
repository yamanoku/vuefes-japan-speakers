<script setup lang="ts">
defineProps<{
  current?: 'home' | 'years' | 'about';
}>();

const { lang, setLang, t } = useVfjsI18n();
</script>

<template>
  <header
    class="border-b border-[var(--rule)] bg-[var(--paper)] sticky top-0 z-20"
    style="backdrop-filter: saturate(1.1)"
    role="banner"
  >
    <div class="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-[14px] px-[var(--pad-x)]">
      <NuxtLink
        to="/"
        class="flex items-baseline gap-[10px] [font-family:var(--font-display)] font-semibold text-[15px] whitespace-nowrap leading-[1.15] text-[var(--ink)] no-underline tracking-[-0.01em]"
        aria-label="Vue Fes Japan Speakers archive — home"
      >
        <span
          class="w-[14px] h-[14px] bg-[var(--accent)] inline-block translate-y-[1px] shrink-0"
          aria-hidden="true"
        />
        <span>Vue Fes Japan<br />Speakers</span>
        <span
          class="[font-family:var(--font-mono)] font-normal text-[11px] tracking-[0.04em] uppercase text-[var(--ink-3)]"
          >/ {{ t.brand_sub }}</span
        >
      </NuxtLink>

      <nav
        class="flex gap-5 justify-self-center [font-family:var(--font-mono)] text-[11px] tracking-[0.08em] uppercase text-[var(--ink-2)]"
        aria-label="Primary"
      >
        <NuxtLink
          to="/"
          class="py-[4px] border-b border-transparent hover:text-[var(--ink)]"
          :class="current === 'home' ? 'border-b-[var(--ink)]' : ''"
          :aria-current="current === 'home' ? 'page' : undefined"
          >{{ t.nav_all }}</NuxtLink
        >
        <a
          href="#years"
          class="py-[4px] border-b border-transparent hover:text-[var(--ink)]"
          :class="current === 'years' ? 'border-b-[var(--ink)]' : ''"
          :aria-current="current === 'years' ? 'page' : undefined"
          >{{ t.nav_by_year }}</a
        >
        <a
          href="#about"
          class="py-[4px] border-b border-transparent hover:text-[var(--ink)]"
          :class="current === 'about' ? 'border-b-[var(--ink)]' : ''"
          :aria-current="current === 'about' ? 'page' : undefined"
          >{{ t.nav_about }}</a
        >
      </nav>

      <div class="flex items-center gap-2">
        <div
          class="inline-flex border border-[var(--rule)] [font-family:var(--font-mono)] text-[11px] tracking-[0.08em]"
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
