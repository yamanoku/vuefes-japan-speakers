<script setup lang="ts">
defineProps<{
  stats: { speakers: number; talks: number; years: number };
}>();

const { t } = useVfjsI18n();
</script>

<template>
  <section
    class="border-b border-[var(--rule)] pt-[clamp(48px,8vw,120px)] pb-[clamp(40px,6vw,72px)] px-[var(--pad-x)]"
  >
    <div class="grid grid-cols-12 gap-6">
      <div
        class="col-span-9 flex items-center gap-[clamp(18px,2.4vw,34px)] max-[800px]:col-span-12 max-[560px]:flex-col max-[560px]:items-start"
      >
        <AppLogoMark
          class="w-[clamp(42px,5vw,72px)] h-auto text-[var(--ink)] mb-[0.08em] max-[560px]:mb-0"
        />
        <h1
          class="m-0 [font-family:var(--font-display)] font-[500] text-[clamp(38px,6.2vw,104px)] leading-[0.96] text-[var(--ink)] break-keep"
        >
          <span>Vue Fes Japan Speakers</span>
        </h1>
      </div>
      <aside
        class="grid items-center col-span-3 [font-family:var(--font-mono)] text-[20px] leading-[1.7] tracking-[0.06em] text-[var(--ink-3)] border-l border-[var(--rule)] pl-[16px] max-[800px]:col-span-12 max-[800px]:border-l-0 max-[800px]:pl-0 max-[800px]:border-t max-[800px]:pt-[16px]"
        aria-label="Archive scope"
      >
        <div>
          <b class="text-[var(--ink)] font-[500] not-italic">{{ stats.speakers }}</b>
          {{ t.meta_speakers }}
        </div>
        <div>
          <b class="text-[var(--ink)] font-[500] not-italic">{{ stats.talks }}</b>
          {{ t.meta_talks }}
        </div>
        <div>
          <b class="text-[var(--ink)] font-[500] not-italic">{{ stats.years }}</b>
          {{ t.meta_years }}
        </div>
      </aside>
      <p
        class="col-span-9 mt-[28px] text-[clamp(16px,1.4vw,20px)] text-[var(--ink-2)] leading-[1.5] m-0 max-[800px]:col-span-12"
      >
        {{ t.sub_all }}
      </p>
    </div>
  </section>
</template>
