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
  view_timeline: string;
  view_index: string;
  view_mode: string;
  skip_to_content: string;
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
  sort_group: string;
  sort_appearances: string;
  sort_name_asc: string;
  sort_name_desc: string;
  sort_latest: string;
  directory_heading: (count: number, sortLabel: string) => string;
  filter_result_status: (shown: number, total: number) => string;
  chronicle_result_status: (shown: number, total: number) => string;
  year_speakers_link: (year: string) => string;
  row_expand: (name: string, count: number) => string;
  row_collapse: (name: string, count: number) => string;
  year_total_talks: (n: number) => string;
  appearance_count: (n: number) => string;
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
    view_timeline: "タイムライン",
    view_index: "スピーカー",
    view_mode: "表示切替",
    skip_to_content: "本文へ",
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
    sort_group: "並び替え",
    sort_appearances: "登壇回数の多い順",
    sort_name_asc: "名前の昇順",
    sort_name_desc: "名前の降順",
    sort_latest: "最新登壇年の新しい順",
    directory_heading: (count: number, sortLabel: string) =>
      `スピーカー一覧（${count}名・${sortLabel}）`,
    filter_result_status: (shown: number, total: number) =>
      `${total}件中${shown}件を表示`,
    chronicle_result_status: (shown: number, total: number) =>
      `${total}件中${shown}件の発表を表示`,
    year_speakers_link: (year: string) => `${year}年のスピーカー一覧へ`,
    row_expand: (name: string, count: number) =>
      `${name}、${count}回登壇、詳細を開く`,
    row_collapse: (name: string, count: number) =>
      `${name}、${count}回登壇、詳細を閉じる`,
    year_total_talks: (n: number) => `全 ${n} 発表`,
    appearance_count: (n: number) => `${n}回登壇`,
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
    view_timeline: "Timeline",
    view_index: "Speakers",
    view_mode: "View mode",
    skip_to_content: "Skip to content",
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
    sort_group: "Sort by",
    sort_appearances: "Most appearances",
    sort_name_asc: "Name A to Z",
    sort_name_desc: "Name Z to A",
    sort_latest: "Latest year first",
    directory_heading: (count: number, sortLabel: string) =>
      `Speakers (${count} · ${sortLabel})`,
    filter_result_status: (shown: number, total: number) =>
      `Showing ${shown} of ${total}`,
    chronicle_result_status: (shown: number, total: number) =>
      `Showing ${shown} of ${total} talks`,
    year_speakers_link: (year: string) => `${year} speakers`,
    row_expand: (name: string, count: number) =>
      `${name}, ${count} appearance${count > 1 ? "s" : ""}, expand details`,
    row_collapse: (name: string, count: number) =>
      `${name}, ${count} appearance${count > 1 ? "s" : ""}, collapse details`,
    year_total_talks: (n: number) => `${n} talks total`,
    appearance_count: (n: number) => `${n} appearance${n > 1 ? "s" : ""}`,
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
