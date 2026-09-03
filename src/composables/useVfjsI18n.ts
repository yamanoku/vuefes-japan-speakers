import { computed, onMounted, ref, watch } from "vue";

export interface VfjsTranslations {
  nav_all_label: string;
  sub_all: string;
  meta_speakers: string;
  meta_talks: string;
  meta_years: string;
  filter_year: string;
  filter_speaker: string;
  filter_all_speakers: string;
  filter_search: string;
  filter_search_ph: string;
  filter_search_hint: string;
  view_timeline: string;
  view_index: string;
  view_mode: string;
  language: string;
  color_scheme: string;
  color_scheme_light: string;
  color_scheme_dark: string;
  color_scheme_system: string;
  empty: string;
  tbd: string;
  external: string;
  session_format_panel: string;
  speaker_profile: string;
  years_appeared: string;
  back_top: string;
  official_site: string;
  related_talks: string;
  all_speakers: string;
  not_found_title: string;
  not_found_description: string;
  skip_links: string;
  skip_to_main: string;
  skip_to_footer: string;
  stats_label: string;
  year_speakers_link: (year: string) => string;
  year_toc: string;
  sort_label: string;
  sort_appearances: string;
  sort_name_asc: string;
  sort_name_desc: string;
  sort_latest: string;
  selected: string;
  year_total_talks: (n: number) => string;
  appearance_count: (n: number) => string;
  directory_heading: (count: number, sortLabel: string) => string;
  filter_result: (shown: number, total: number) => string;
  filter_result_talks: (n: number) => string;
  directory_row_label: (name: string, count: number, expanded: boolean) => string;
}

const translations: Record<"ja" | "en", VfjsTranslations> = {
  ja: {
    nav_all_label: "全スピーカー一覧",
    sub_all:
      "Vue Fes Japan に登壇したすべてのスピーカーと発表タイトルをまとめた非公式アーカイブです。",
    meta_speakers: "登壇者",
    meta_talks: "発表",
    meta_years: "開催年",
    filter_year: "年度",
    filter_speaker: "発表者",
    filter_all_speakers: "すべての発表者",
    filter_search: "キーワードで絞り込み",
    filter_search_ph: "発表タイトル・スピーカー名で検索",
    filter_search_hint: "英語名、ふりがな、公式ページの表記でも検索できます。",
    view_timeline: "タイムライン",
    view_index: "スピーカー",
    view_mode: "表示切替",
    language: "言語",
    color_scheme: "配色",
    color_scheme_light: "ライト",
    color_scheme_dark: "ダーク",
    color_scheme_system: "システム",
    empty: "該当するスピーカーが見つかりません。",
    tbd: "タイトル未定",
    external: "外部サイトへ移動",
    session_format_panel: "パネル",
    speaker_profile: "スピーカー",
    years_appeared: "登壇年",
    back_top: "TOPページに戻る",
    official_site: "公式サイト",
    related_talks: "発表一覧",
    all_speakers: "発表者一覧",
    not_found_title: "ページが見つかりません",
    not_found_description: "指定されたページは存在しないか、移動した可能性があります。",
    skip_links: "スキップリンク",
    skip_to_main: "本文へ",
    skip_to_footer: "フッターへ",
    stats_label: "開催概要",
    year_speakers_link: (year) => `${year} のスピーカー`,
    year_toc: "年度",
    sort_label: "並び替え",
    sort_appearances: "登壇回数の多い順",
    sort_name_asc: "名前順（A→Z）",
    sort_name_desc: "名前順（Z→A）",
    sort_latest: "最新年の新しい順",
    selected: "選択中",
    year_total_talks: (n: number) => `全 ${n} 発表`,
    appearance_count: (n: number) => `${n}回登壇`,
    directory_heading: (count, sortLabel) => `スピーカー一覧（${count}名・${sortLabel}）`,
    filter_result: (shown, total) => `${total}件中${shown}件を表示`,
    filter_result_talks: (n) => `${n}件の発表を表示`,
    directory_row_label: (name, count, expanded) =>
      `${name}、${count}回登壇、${expanded ? "詳細を閉じる" : "詳細を開く"}`,
  },
  en: {
    nav_all_label: "All speakers",
    sub_all:
      "An unofficial, community-maintained index of every speaker and talk at Vue Fes Japan.",
    meta_speakers: "Speakers",
    meta_talks: "Talks",
    meta_years: "Editions",
    filter_year: "Year",
    filter_speaker: "Speaker",
    filter_all_speakers: "All speakers",
    filter_search: "Search",
    filter_search_ph: "Search talk titles or speaker names",
    filter_search_hint: "English names, readings, and official page spellings are included.",
    view_timeline: "Timeline",
    view_index: "Speakers",
    view_mode: "View mode",
    language: "Language",
    color_scheme: "Color scheme",
    color_scheme_light: "Light",
    color_scheme_dark: "Dark",
    color_scheme_system: "System",
    empty: "No speakers match the current filters.",
    tbd: "TBD",
    external: "External Site",
    session_format_panel: "Panel",
    speaker_profile: "Speaker",
    years_appeared: "Appeared in",
    back_top: "Back to top page",
    official_site: "Official site",
    related_talks: "Talks",
    all_speakers: "Speakers",
    not_found_title: "Page Not Found",
    not_found_description: "The page you requested does not exist or may have moved.",
    skip_links: "Skip links",
    skip_to_main: "Skip to main content",
    skip_to_footer: "Skip to footer",
    stats_label: "Overview",
    year_speakers_link: (year) => `${year} speakers`,
    year_toc: "Years",
    sort_label: "Sort",
    sort_appearances: "Most appearances",
    sort_name_asc: "Name A to Z",
    sort_name_desc: "Name Z to A",
    sort_latest: "Latest year",
    selected: "selected",
    year_total_talks: (n: number) => `${n} talks total`,
    appearance_count: (n: number) => `${n} appearance${n > 1 ? "s" : ""}`,
    directory_heading: (count, sortLabel) => `Speakers (${count}, ${sortLabel})`,
    filter_result: (shown, total) => `Showing ${shown} of ${total}`,
    filter_result_talks: (n) => `Showing ${n} talks`,
    directory_row_label: (name, count, expanded) =>
      `${name}, ${count} appearance${count > 1 ? "s" : ""}, ${expanded ? "Collapse details" : "Expand details"}`,
  },
};

const lang = ref<"ja" | "en">("ja");

export const useVfjsI18n = () => {
  onMounted(() => {
    const stored = localStorage.getItem("vfjs:lang") as "ja" | "en" | null;
    if (stored === "ja" || stored === "en") {
      lang.value = stored;
    }
  });

  watch(lang, (value) => {
    if (typeof document !== "undefined") {
      localStorage.setItem("vfjs:lang", value);
      document.documentElement.lang = value;
    }
  });

  const setLang = (value: "ja" | "en") => {
    lang.value = value;
  };
  const t = computed(() => translations[lang.value as "ja" | "en"]);

  return { lang, setLang, t };
};
