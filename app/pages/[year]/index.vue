<script setup lang="ts">
import { useFetchSpeaker } from '~/composables/speaker';
import { isValidYear } from '~/utils/years';
import { hasJapanese } from '~/utils/speakerMap';
import type { AcceptedYear } from '~~/types';

definePageMeta({
  validate: (route) => isValidYear(route.params.year as string),
});

const route = useRoute();
const year = route.params.year as AcceptedYear;

const { filterYearSpeaker } = await useFetchSpeaker(year);

const { t } = useVfjsI18n();

useHead({ title: `Vue Fes Japan ${year}` });
</script>

<template>
  <div
    style="
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    "
  >
    <AppChrome current="years" />

    <nav class="px-[var(--pad-x)] pt-[20px]">
      <NuxtLink
        to="/"
        class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-3)] no-underline tracking-[0.05em] hover:text-[var(--ink)]"
        >← {{ t.back_top }}</NuxtLink
      >
    </nav>

    <header
      class="border-b border-[var(--rule)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-[var(--pad-x)]"
    >
      <h1
        class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-bold tracking-[-0.04em] leading-[1] mb-[16px]"
      >
        Vue Fes Japan <em class="not-italic text-[var(--accent)]">{{ year }}</em>
      </h1>
      <div class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-3)]">
        <div>{{ t.year_total_talks(filterYearSpeaker?.length ?? 0) }}</div>
        <div class="mt-[8px]">
          <a
            :href="`https://vuefes.jp/${year}/`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-inherit hover:text-[var(--ink)]"
          >
            {{ t.official_site }} ↗
          </a>
        </div>
      </div>
    </header>

    <section>
      <ol class="list-none p-0 m-0">
        <li class="border-b border-[var(--rule)]">
          <ul class="list-none p-0 m-0">
            <li
              v-for="(s, i) in filterYearSpeaker"
              :key="i"
              class="grid grid-cols-[40px_1fr] border-t border-[var(--rule-softer)] py-[18px]"
            >
              <div
                class="[font-family:var(--font-mono)] text-[11px] text-[var(--ink-4)] pt-[3px] text-center"
                aria-hidden="true"
              >
                <span>{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
              <div class="pr-[24px]">
                <div class="flex flex-wrap gap-x-[8px] gap-y-[4px] mb-[4px] items-center">
                  <template v-for="(n, ni) in s.name" :key="n">
                    <span v-if="ni > 0" class="text-[var(--ink-4)] text-[12px]" aria-hidden="true">
                      ×
                    </span>
                    <NuxtLink
                      class="text-[15px] font-semibold no-underline text-[var(--ink)] tracking-[-0.01em] hover:text-[var(--accent)]"
                      :to="`/speakers/${encodeURIComponent(n)}`"
                    >
                      <span :lang="hasJapanese(n) ? 'ja' : 'en'">{{ n }}</span>
                    </NuxtLink>
                  </template>
                </div>
                <div class="text-[14px] text-[var(--ink-3)]">
                  <a
                    v-if="s.title"
                    :href="s.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-inherit no-underline hover:text-[var(--ink)] flex items-baseline gap-[4px]"
                  >
                    <span :lang="hasJapanese(s.title) ? 'ja' : 'en'">{{ s.title }}</span>
                    <span class="text-[11px] opacity-70" :aria-label="t.external">↗</span>
                  </a>
                  <span v-else class="italic text-[var(--ink-4)]">{{ t.tbd }}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ol>
    </section>

    <footer
      class="border-t border-[var(--rule)] flex flex-wrap gap-x-[24px] gap-y-[8px] items-baseline justify-between px-[var(--pad-x)] py-[20px] text-[12px] text-[var(--ink-3)] [font-family:var(--font-mono)]"
    >
      <div>
        Unofficial community archive.
        <NuxtLink to="/" class="text-inherit hover:text-[var(--ink)]">{{ t.back_top }}</NuxtLink>
      </div>
      <div>{{ year }} · {{ filterYearSpeaker?.length ?? 0 }} talks</div>
    </footer>
  </div>
</template>
