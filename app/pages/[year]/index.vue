<script setup lang="ts">
import { useFetchSpeaker } from '~/composables/speaker';
import { isValidYear } from '~/utils/years';
import type { AcceptedYear } from '~~/types';

definePageMeta({
  validate: (route) => isValidYear(route.params.year as string),
});

const route = useRoute();
const year = route.params.year as AcceptedYear;

const { filterYearSpeaker } = await useFetchSpeaker(year);

const { t, lang } = useVfjsI18n();

useHead({ title: `Vue Fes Japan ${year}` });
</script>

<template>
  <div>
    <AppHeader />

    <main>
      <header
        class="border-b border-[var(--rule)] pt-[clamp(32px,5vw,72px)] pb-[clamp(24px,4vw,48px)] px-[var(--pad-x)]"
      >
        <h1
          class="[font-family:var(--font-display)] text-[clamp(28px,4.5vw,72px)] font-bold tracking-[-0.04em] leading-[1] mb-[16px]"
        >
          Vue Fes Japan <span v-if="year === '2022'">Online </span
          ><em class="not-italic text-[var(--accent)]">{{ year }}</em>
        </h1>
        <div class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)]">
          <div>{{ t.year_total_talks(filterYearSpeaker?.length ?? 0) }}</div>
          <div class="mt-[8px]">
            <a
              :href="`https://vuefes.jp/${year}/`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[var(--ink)] no-underline flex items-baseline gap-[4px]"
            >
              <span class="hover:underline">{{ t.official_site }}</span
              ><span>{{ t.external }}</span>
            </a>
          </div>
        </div>
      </header>

      <section class="px-[var(--pad-x)] py-[40px]">
        <ol class="list-none p-0 m-0">
          <li class="border-b border-[var(--rule)]">
            <ul class="list-none p-0 m-0">
              <li
                v-for="(s, i) in filterYearSpeaker"
                :key="i"
                class="grid grid-cols-[40px_1fr] border-t border-[var(--rule-softer)] py-[18px]"
              >
                <div
                  class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] pt-[5px] text-center"
                  aria-hidden="true"
                >
                  <span>{{ String(i + 1).padStart(2, '0') }}</span>
                </div>
                <div class="pr-[24px]">
                  <div class="flex flex-wrap gap-x-[8px] gap-y-[4px] mb-[6px] items-center">
                    <template v-for="(n, ni) in s.name" :key="n">
                      <span
                        v-if="ni > 0"
                        class="text-[var(--ink-2)] text-[12px]"
                        aria-hidden="true"
                      >
                        ×
                      </span>
                      <NuxtLink
                        class="text-[18px] [font-family:var(--font-mono)] border-b border-[var(--rule-soft)] pb-[1px] no-underline transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        :to="`/speakers/${encodeURIComponent(n)}`"
                      >
                        <ruby v-if="s.nameRuby?.[ni] && lang === 'ja'" lang="ja"
                          >{{ n }}<rt>{{ s.nameRuby[ni] }}</rt></ruby
                        >
                        <span v-else>{{ lang === 'en' && s.nameEn?.[ni] ? s.nameEn[ni] : n }}</span>
                      </NuxtLink>
                    </template>
                  </div>
                  <div class="text-[14px] text-[var(--ink-2)]">
                    <a
                      v-if="s.title"
                      :href="s.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="no-underline"
                    >
                      <span
                        v-if="s.format === 'panel'"
                        class="relative top-[-1px] inline-flex items-center self-center align-middle [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] border border-[var(--ink)] text-[var(--ink)] px-[5px] py-[1px] leading-[1.15] mr-[8px]"
                        >{{ t.session_format_panel }}</span
                      >
                      <span>{{ s.title }}</span>
                      <span class="text-[10px] ml-[4px]">({{ t.external }})</span>
                    </a>
                    <span v-else class="italic text-[var(--ink-2)] no-underline">{{ t.tbd }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ol>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
