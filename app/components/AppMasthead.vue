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
    <div class="grid grid-cols-12 gap-6 items-end">
      <h1
        class="col-span-9 m-0 [font-family:var(--font-display)] font-[500] text-[clamp(38px,6.2vw,104px)] leading-[0.96] tracking-[-0.03em] text-[var(--ink)] word-break-keep-all max-[800px]:col-span-12"
      >
        <span>Vue Fes Japan Speakers</span>
      </h1>
      <aside
        class="col-span-3 [font-family:var(--font-mono)] text-[12px] leading-[1.7] tracking-[0.06em] text-[var(--ink-3)] border-l border-[var(--rule-soft)] pl-[16px] max-[800px]:col-span-12 max-[800px]:border-l-0 max-[800px]:pl-0 max-[800px]:border-t max-[800px]:pt-[16px]"
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
