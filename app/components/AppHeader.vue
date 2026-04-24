<script setup lang="ts">
const { lang, setLang, t } = useVfjsI18n();
const { scheme, setScheme } = useColorScheme();
</script>

<template>
  <header
    class="border-b border-[var(--rule)] bg-[var(--paper)] sticky top-0 z-20"
    style="backdrop-filter: saturate(1.1)"
    role="banner"
  >
    <div class="flex flex-wrap justify-between items-center gap-2 py-[14px] px-[var(--pad-x)]">
      <NuxtLink
        to="/"
        class="flex items-center gap-[10px] [font-family:var(--font-display)] font-semibold text-[15px] whitespace-nowrap leading-[1.15] text-[var(--ink)] no-underline hover:text-[var(--accent)] transition-colors"
      >
        <AppLogoMark class="w-[16px] h-auto text-[var(--ink)]" />
        <span>Vue Fes Japan Speakers</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <select
          class="border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] [font-family:var(--font-mono)] text-[12px] tracking-[0.08em] px-[8px] py-[5px] cursor-pointer"
          :aria-label="t.color_scheme"
          :value="scheme"
          @change="
            setScheme(($event.target as HTMLSelectElement).value as 'light' | 'dark' | 'system')
          "
        >
          <option value="light">{{ t.color_scheme_light }}</option>
          <option value="dark">{{ t.color_scheme_dark }}</option>
          <option value="system">{{ t.color_scheme_system }}</option>
        </select>
        <div
          class="inline-flex border border-[var(--rule)] [font-family:var(--font-mono)] text-[12px] tracking-[0.08em]"
          role="group"
          :aria-label="t.language"
        >
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer"
            :class="lang === 'ja' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--ink-2)]'"
            :aria-pressed="lang === 'ja' ? 'true' : 'false'"
            @click="setLang('ja')"
          >
            JA
          </button>
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer border-l border-[var(--rule)]"
            :class="lang === 'en' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--ink-2)]'"
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
