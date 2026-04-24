<script setup lang="ts">
import { computed, ref } from "vue";
import type { SpeakerWithYear, AcceptedYear } from "~~/types";
import { compareLexicalJa } from "~/utils/stringCollate";
import { buildSpeakerMap, hasJapanese } from "~/utils/speakerMap";
import type { SpeakerRecord } from "~/utils/speakerMap";
import { YEARS } from "~~/types";
import SpeakerFilterBar from "~/components/SpeakerFilterBar.vue";
import YearFilterBar from "~/components/YearFilterBar.vue";
import { useVfjsI18n } from "~/composables/useVfjsI18n";

const props = defineProps<{
  allSpeakers: SpeakerWithYear[];
  selectedYear: AcceptedYear | "all";
  selectedSpeaker: string;
  query: string;
}>();

const emit = defineEmits<{
  "update:selectedYear": [AcceptedYear | "all"];
  "update:selectedSpeaker": [string];
  "update:query": [string];
}>();

const { t, lang } = useVfjsI18n();

const speakerMap = computed(() => buildSpeakerMap(props.allSpeakers));
const allRecords = computed(() => Array.from(speakerMap.value.values()));
const speakerOptions = computed(() =>
  allRecords.value.map((record) => ({
    label: `${record.name} (${record.talks.length})`,
    value: record.name,
  })),
);

const sort = ref<"name" | "appearances" | "latest">("appearances");

const counts = computed(() => {
  const c: Record<string, number> = { all: allRecords.value.length };
  for (const y of YEARS) {
    c[y] = props.allSpeakers.filter((s) => s.year === y).length;
  }
  return c;
});

const filtered = computed<SpeakerRecord[]>(() => {
  const q = props.query.trim().toLowerCase();
  let list = allRecords.value.filter((rec) => {
    if (props.selectedYear !== "all" && !rec.years.includes(props.selectedYear)) return false;
    if (props.selectedSpeaker !== "all" && rec.name !== props.selectedSpeaker) return false;
    if (q) {
      const titles = rec.talks.map((tk) => tk.title || "").join(" ");
      const hay = (rec.name + " " + titles).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sort.value === "appearances") {
    list = [...list].sort(
      (a, b) =>
        b.talks.length - a.talks.length ||
        compareLexicalJa(a.years[0] || "", b.years[0] || "") ||
        compareLexicalJa(a.name, b.name),
    );
  } else if (sort.value === "name") {
    list = [...list].sort((a, b) => compareLexicalJa(a.name, b.name));
  } else if (sort.value === "latest") {
    list = [...list].sort(
      (a, b) =>
        compareLexicalJa(b.years[b.years.length - 1] || "", a.years[a.years.length - 1] || "") ||
        compareLexicalJa(a.name, b.name),
    );
  }
  return list;
});

const openRows = ref(new Set<string>());

function toggleRow(name: string) {
  const next = new Set(openRows.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  openRows.value = next;
}
</script>

<template>
  <main>
    <section :style="{ '--idxpad': '14px' }">
      <SpeakerFilterBar
        :query="query"
        :selected-speaker="selectedSpeaker"
        :speaker-options="speakerOptions"
        @update:query="emit('update:query', $event)"
        @update:selected-speaker="emit('update:selectedSpeaker', $event)"
      />

      <YearFilterBar
        :selected-year="selectedYear"
        :counts="counts"
        @update:selected-year="emit('update:selectedYear', $event)"
      />

      <!-- Sort header -->
      <div
        class="flex items-center gap-[8px] px-[var(--pad-x)] pt-[18px] pb-[10px] border-b border-[var(--rule-soft)] [font-family:var(--font-mono)] overflow-x-auto"
      >
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'name'
              ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
              : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
          "
          @click="sort = 'name'"
        >
          Name A→Z
        </button>
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'appearances'
              ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
              : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
          "
          @click="sort = 'appearances'"
        >
          Appearances ↓
        </button>
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'latest'
              ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]'
              : 'border-[var(--rule-soft)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
          "
          @click="sort = 'latest'"
        >
          Latest year ↓
        </button>
        <span class="ml-auto text-[12px] tracking-[0.06em] text-[var(--ink-3)] whitespace-nowrap">
          {{ String(filtered.length).padStart(3, "0") }} /
          {{ String(allRecords.length).padStart(3, "0") }}
        </span>
      </div>

      <div
        v-if="filtered.length === 0"
        class="px-[var(--pad-x)] py-[80px] text-center [font-family:var(--font-mono)] text-[13px] tracking-[0.05em] uppercase text-[var(--ink-3)]"
      >
        {{ t.empty }}
      </div>

      <ol class="list-none p-0 m-0">
        <li
          v-for="(rec, i) in filtered"
          :key="rec.name"
          class="border-b border-[var(--rule-softer)]"
          :data-open="openRows.has(rec.name) ? 'true' : 'false'"
        >
          <button
            class="w-full flex flex-wrap items-center gap-x-[12px] px-[var(--pad-x)] py-[var(--idxpad)] cursor-pointer text-left"
            :class="openRows.has(rec.name) ? 'bg-[var(--paper-2)]' : ''"
            :aria-expanded="openRows.has(rec.name)"
            @click="toggleRow(rec.name)"
          >
            <span
              class="basis-0 grow-999 min-inline-[50%] flex flex-wrap gap-[8px] justify-start items-center"
            >
              <span
                class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] tabular-nums"
                aria-hidden="true"
              >
                {{ String(i + 1).padStart(3, "0") }}
              </span>
              <span
                class="[font-family:var(--font-display)] text-[clamp(15px,1.2vw,18px)] font-[500] tracking-[-0.005em] text-[var(--ink)]"
                :lang="hasJapanese(rec.name) ? 'ja' : 'en'"
              >
                <ruby v-if="rec.nameRuby && lang === 'ja'">
                  {{ rec.name }}
                  <rt>{{ rec.nameRuby }}</rt>
                </ruby>
                <template v-else>
                  {{ lang === "en" && rec.nameEn ? rec.nameEn : rec.name }}
                </template>
                <span
                  v-if="rec.talks.length > 1"
                  class="[font-family:var(--font-mono)] bg-[var(--accent)] text-[12px] text-[var(--accent-ink)] ml-[8px] font-normal tracking-[0.02em] align-[2px] border border-[var(--accent)] px-[5px] py-[1px]"
                  :aria-label="t.appearance_count(rec.talks.length)"
                >
                  ×{{ rec.talks.length }}
                </span>
              </span>
              <span
                class="inline-grid gap-[3px] grow-999 justify-end"
                style="grid-template-columns: repeat(6, 28px)"
                :aria-label="t.years_appeared + ': ' + rec.years.join(', ')"
              >
                <span
                  v-for="y in YEARS"
                  :key="y"
                  class="w-[28px] h-[22px] flex items-center justify-center [font-family:var(--font-mono)] text-[12px] tracking-[0]"
                  :class="[
                    rec.years.includes(y) && selectedYear === y
                      ? 'bg-[var(--accent)] border border-[var(--accent)] text-white'
                      : rec.years.includes(y)
                        ? 'bg-[var(--ink)] border border-[var(--ink)] text-[var(--paper)]'
                        : 'border border-[var(--ink)] text-[var(--ink)]',
                  ]"
                  :title="y"
                >
                  {{ y.slice(-2) }}
                </span>
              </span>
            </span>
            <span
              class="basis-[24px] grow-1 [font-family:var(--font-mono)] text-[16px] text-[var(--ink-3)] text-center"
              aria-hidden="true"
            >
              {{ openRows.has(rec.name) ? "−" : "+" }}
            </span>
          </button>
          <div
            v-if="openRows.has(rec.name)"
            class="bg-[var(--paper-2)] border-t border-[var(--rule-softer)] pt-[8px] pb-[22px] px-[var(--pad-x)]"
          >
            <a
              class="[font-family:var(--font-mono)] text-[12px] tracking-[0.06em] text-[var(--ink)] underline hover:no-underline"
              :href="`/speakers/${encodeURIComponent(rec.name)}`"
            >
              {{ t.speaker_profile }}: {{ rec.name }}
            </a>
            <ol class="list-none p-0 m-0 mt-[14px]">
              <li
                v-for="(talk, k) in rec.talks"
                :key="k"
                class="grid gap-[16px] items-baseline py-[6px] border-t border-[var(--rule-softer)]"
                style="grid-template-columns: 56px minmax(0, 1fr) auto"
                :class="k === 0 ? 'border-t-0' : ''"
              >
                <a
                  :href="`/${talk.year}`"
                  class="underline hover:no-underline [font-family:var(--font-mono)] text-[12px] text-[var(--ink)] tabular-nums"
                >
                  {{ talk.year }}
                </a>
                <a
                  class="text-[14px] text-[var(--ink)] pb-[1px] leading-[1.45] no-underline"
                  :href="talk.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    v-if="talk.format === 'panel'"
                    class="relative top-[-1px] inline-flex items-center self-center align-middle [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.06em] border border-[var(--accent)] text-[var(--accent)] px-[5px] py-[1px] leading-[1.15] mr-[8px]"
                  >
                    {{ t.session_format_panel }}
                  </span>
                  <span class="hover:underline">{{ talk.title || t.tbd }}</span>
                  <span
                    class="[font-family:var(--font-mono)] text-[12px] text-[var(--ink-2)] ml-[4px]"
                    :aria-label="t.external"
                  >
                    ↗
                  </span>
                </a>
                <span
                  v-if="talk.coSpeakers.length > 0"
                  class="text-[12px] [font-family:var(--font-mono)] text-[var(--ink-3)]"
                >
                  w/
                  <template v-for="(cn, ci) in talk.coSpeakers" :key="cn">
                    <template v-if="ci > 0">,</template>
                    <a
                      class="text-[var(--ink)] border-b border-[var(--rule-soft)] pb-[1px] no-underline hover:border-[var(--ink)]"
                      :href="`/speakers/${encodeURIComponent(cn)}`"
                    >
                      {{ cn }}
                    </a>
                  </template>
                </span>
              </li>
            </ol>
          </div>
        </li>
      </ol>
    </section>
  </main>
</template>
