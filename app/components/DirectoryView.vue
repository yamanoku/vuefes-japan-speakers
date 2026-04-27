<script setup lang="ts">
import { computed, ref } from "vue";
import type { SpeakerWithYear, AcceptedYear } from "../../types";
import { compareLexicalJa } from "../utils/stringCollate";
import { buildSpeakerMap, hasJapanese } from "../utils/speakerMap";
import type { SpeakerRecord } from "../utils/speakerMap";
import { YEARS } from "../../types";
import SpeakerFilterBar from "./SpeakerFilterBar.vue";
import YearFilterBar from "./YearFilterBar.vue";
import { useVfjsI18n } from "../composables/useVfjsI18n";

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

const sort = ref<"name-asc" | "name-desc" | "appearances" | "latest">("appearances");

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
  } else if (sort.value === "name-asc") {
    list = [...list].sort((a, b) => compareLexicalJa(a.name, b.name));
  } else if (sort.value === "name-desc") {
    list = [...list].sort((a, b) => compareLexicalJa(b.name, a.name));
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
  <!-- ディレクトリビュー：スピーカーを人物単位でまとめ、アコーディオンで登壇履歴を表示するビュー -->
  <main>
    <section>
      <!-- スピーカー名・キーワードによるフィルターバー -->
      <SpeakerFilterBar
        :query="query"
        :selected-speaker="selectedSpeaker"
        :speaker-options="speakerOptions"
        @update:query="emit('update:query', $event)"
        @update:selected-speaker="emit('update:selectedSpeaker', $event)"
      />

      <!-- 開催年度によるフィルターバー -->
      <YearFilterBar
        :selected-year="selectedYear"
        :counts="counts"
        @update:selected-year="emit('update:selectedYear', $event)"
      />

      <!-- Sort header -->
      <!-- ソートボタンヘッダー（登壇回数・名前順・最新年で並び替え） -->
      <div
        class="flex items-center gap-2 px-pad-x pt-4.5 pb-2.5 border-b border-rule-soft font-mono overflow-x-auto"
      >
        <!-- 登壇回数の多い順でソートするボタン -->
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'appearances'
              ? 'bg-ink text-paper border-ink'
              : 'border-rule-soft text-ink-3 hover:text-ink hover:border-ink'
          "
          @click="sort = 'appearances'"
        >
          Appearances ↓
        </button>
        <!-- 名前の昇順/降順でソートするボタン -->
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'name-asc' || sort === 'name-desc'
              ? 'bg-ink text-paper border-ink'
              : 'border-rule-soft text-ink-3 hover:text-ink hover:border-ink'
          "
          @click="sort = sort === 'name-asc' ? 'name-desc' : 'name-asc'"
        >
          Name {{ sort === "name-desc" ? "Z→A" : "A→Z" }}
        </button>
        <!-- 最新登壇年の新しい順でソートするボタン -->
        <button
          class="text-[12px] tracking-[0.06em] uppercase px-[10px] py-[5px] border cursor-pointer whitespace-nowrap"
          :class="
            sort === 'latest'
              ? 'bg-ink text-paper border-ink'
              : 'border-rule-soft text-ink-3 hover:text-ink hover:border-ink'
          "
          @click="sort = 'latest'"
        >
          Latest year ↓
        </button>
        <!-- フィルター済み件数 / 全体件数の表示 -->
        <span class="ml-auto text-[12px] tracking-[0.06em] text-ink-3 whitespace-nowrap">
          {{ String(filtered.length).padStart(3, "0") }} /
          {{ String(allRecords.length).padStart(3, "0") }}
        </span>
      </div>

      <!-- フィルター結果が0件のときの空状態メッセージ -->
      <div
        v-if="filtered.length === 0"
        class="px-pad-x py-20 text-center font-mono text-[13px] tracking-[0.05em] uppercase text-ink-3"
      >
        {{ t.empty }}
      </div>

      <!-- スピーカー一覧リスト -->
      <ol class="list-none p-0 m-0">
        <li
          v-for="(rec, i) in filtered"
          :key="rec.name"
          class="border-b border-rule-softer"
          :data-open="openRows.has(rec.name) ? 'true' : 'false'"
        >
          <!-- スピーカー行の展開/折りたたみボタン -->
          <button
            class="w-full flex flex-wrap items-center gap-x-[12px] px-pad-x py-3.5 cursor-pointer text-left"
            :class="openRows.has(rec.name) ? 'bg-paper-2' : ''"
            :aria-expanded="openRows.has(rec.name)"
            @click="toggleRow(rec.name)"
          >
            <span
              class="basis-0 grow-999 min-inline-[50%] flex flex-wrap gap-2 justify-start items-center"
            >
              <!-- 行番号（表示専用） -->
              <span
                class="font-mono text-[12px] text-ink-2 tabular-nums"
                aria-hidden="true"
              >
                {{ String(i + 1).padStart(3, "0") }}
              </span>
              <!-- スピーカー名（振り仮名・英語名対応） -->
              <span
                class="font-display text-[clamp(15px,1.2vw,18px)] font-[500] tracking-[-0.005em] text-ink"
                :lang="hasJapanese(rec.name) ? 'ja' : 'en'"
              >
                <ruby v-if="rec.nameRuby && lang === 'ja'">
                  {{ rec.name }}
                  <rt>{{ rec.nameRuby }}</rt>
                </ruby>
                <template v-else>
                  {{ lang === "en" && rec.nameEn ? rec.nameEn : rec.name }}
                </template>
                <!-- 複数回登壇バッジ（登壇回数を ×N 形式で表示） -->
                <span
                  v-if="rec.talks.length > 1"
                  class="font-mono bg-accent text-[12px] text-accent-ink ml-2 font-normal tracking-[0.02em] align-[2px] border border-accent px-1.25 py-[1px]"
                  :aria-label="t.appearance_count(rec.talks.length)"
                >
                  <span>×{{ rec.talks.length }}</span>
                </span>
              </span>
              <!-- 登壇年度グリッド（各年のマスを塗りつぶして登壇済みかを可視化） -->
              <span
                class="inline-grid gap-[3px] grow-999 justify-end"
                style="grid-template-columns: repeat(6, 28px)"
                :aria-label="t.years_appeared + ': ' + rec.years.join(', ')"
              >
                <span
                  v-for="y in YEARS"
                  :key="y"
                  class="w-7 h-[22px] flex items-center justify-center font-mono text-[12px] tracking-[0]"
                  :class="[
                    rec.years.includes(y) && selectedYear === y
                      ? 'bg-accent border border-accent text-white'
                      : rec.years.includes(y)
                        ? 'bg-ink border border-ink text-paper'
                        : 'border border-ink text-ink',
                  ]"
                  :title="y"
                >
                  {{ y.slice(-2) }}
                </span>
              </span>
            </span>
            <!-- 展開/折りたたみアイコン（+/−） -->
            <span
              class="basis-6 grow-1 font-mono text-[16px] text-ink-3 text-center"
              aria-hidden="true"
            >
              {{ openRows.has(rec.name) ? "−" : "+" }}
            </span>
          </button>
          <!-- 展開時の詳細エリア（プロフィールリンクと登壇一覧） -->
          <div
            v-if="openRows.has(rec.name)"
            class="bg-paper-2 border-t border-rule-softer pt-2 pb-[22px] px-pad-x"
          >
            <!-- スピーカープロフィールページへのリンク -->
            <a
              class="font-mono text-[12px] tracking-[0.06em] text-ink underline hover:no-underline"
              :href="`/speakers/${encodeURIComponent(rec.name)}`"
            >
              {{ t.speaker_profile }}: {{ rec.name }}
            </a>
            <!-- 登壇一覧リスト -->
            <ol class="list-none p-0 m-0 mt-[14px]">
              <!-- 各登壇情報（開催年・タイトル・共同登壇者） -->
              <li
                v-for="(talk, k) in rec.talks"
                :key="k"
                class="grid grid-cols-[30px_1fr] gap-4 items-baseline py-1.5 border-t border-rule-softer"
                :class="k === 0 ? 'border-t-0' : ''"
              >
                <!-- 開催年リンク（年度別ページへ） -->
                <a
                  :href="`/${talk.year}`"
                  class="underline hover:no-underline font-mono text-[12px] text-ink tabular-nums"
                >
                  {{ talk.year }}
                </a>
                <div class="flex flex-col gap-y-[8px]">
                  <!-- トークタイトル（外部リンク） -->
                  <a
                    class="text-[14px] text-ink pb-[1px] leading-[1.45] no-underline group"
                    :href="talk.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <!-- パネルセッションのフォーマットバッジ -->
                    <span
                      v-if="talk.format === 'panel'"
                      class="relative top-[-1px] inline-flex items-center self-center align-middle font-mono text-[10px] uppercase tracking-[0.06em] border border-ink text-ink px-[5px] py-[1px] leading-[1.15] mr-2"
                    >
                      {{ t.session_format_panel }}
                    </span>
                    <span class="group-hover:underline">{{ talk.title || t.tbd }}</span>
                    <span class="font-mono text-[10px] text-ink-2 ml-1">
                      ({{ t.external }})
                    </span>
                  </a>
                  <!-- 共同登壇者のリスト（各スピーカープロフィールへのリンク） -->
                  <span
                    v-if="talk.coSpeakers.length > 0"
                    class="text-[12px] font-mono text-ink-3"
                  >
                    w/
                    <template v-for="(cn, ci) in talk.coSpeakers" :key="cn">
                      <template v-if="ci > 0">,</template>
                      <a
                        class="text-ink border-b border-rule-soft pb-[1px] no-underline hover:border-ink"
                        :href="`/speakers/${encodeURIComponent(cn)}`"
                      >
                        {{ cn }}
                      </a>
                    </template>
                  </span>
                </div>
              </li>
            </ol>
          </div>
        </li>
      </ol>
    </section>
  </main>
</template>
