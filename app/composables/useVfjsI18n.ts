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
  year_total_talks: (n: number) => string;
  appearance_count: (n: number) => string;
}

const translations: Record<'ja' | 'en', VfjsTranslations> = {
  ja: {
    nav_all_label: '全スピーカー一覧',
    sub_all:
      'Vue Fes Japan に登壇したすべてのスピーカーと発表タイトルをまとめた非公式アーカイブです。',
    meta_speakers: '登壇者',
    meta_talks: '発表',
    meta_years: '開催年',
    filter_year: '年度',
    filter_speaker: '発表者',
    filter_all_speakers: 'すべての発表者',
    filter_search: 'キーワードで絞り込み',
    filter_search_ph: '発表タイトル・スピーカー名で検索',
    view_timeline: 'タイムライン',
    view_index: '一覧',
    language: '言語',
    color_scheme: '配色',
    color_scheme_light: 'ライト',
    color_scheme_dark: 'ダーク',
    color_scheme_system: 'システム',
    empty: '該当するスピーカーが見つかりません。',
    tbd: 'タイトル未定',
    external: '外部サイトへ移動',
    session_format_panel: 'パネル',
    speaker_profile: 'スピーカー',
    years_appeared: '登壇年',
    back_top: 'TOPページに戻る',
    official_site: '公式サイト',
    related_talks: '発表一覧',
    all_speakers: '発表者一覧',
    year_total_talks: (n: number) => `全 ${n} 発表`,
    appearance_count: (n: number) => `${n}回登壇`,
  },
  en: {
    nav_all_label: 'All speakers',
    sub_all:
      'An unofficial, community-maintained index of every speaker and talk at Vue Fes Japan.',
    meta_speakers: 'Speakers',
    meta_talks: 'Talks',
    meta_years: 'Editions',
    filter_year: 'Year',
    filter_speaker: 'Speaker',
    filter_all_speakers: 'All speakers',
    filter_search: 'Search',
    filter_search_ph: 'Search talk titles or speaker names',
    view_timeline: 'Timeline',
    view_index: 'Index',
    language: 'Language',
    color_scheme: 'Color scheme',
    color_scheme_light: 'Light',
    color_scheme_dark: 'Dark',
    color_scheme_system: 'System',
    empty: 'No speakers match the current filters.',
    tbd: 'TBD',
    external: 'External Site',
    session_format_panel: 'Panel',
    speaker_profile: 'Speaker',
    years_appeared: 'Appeared in',
    back_top: 'Back to top page',
    official_site: 'Official site',
    related_talks: 'Talks',
    all_speakers: 'Speakers',
    year_total_talks: (n: number) => `${n} talks total`,
    appearance_count: (n: number) => `${n} appearance${n > 1 ? 's' : ''}`,
  },
};

export const useVfjsI18n = () => {
  const lang = useState<'ja' | 'en'>('vfjs:lang', () => 'ja');

  onMounted(() => {
    const stored = localStorage.getItem('vfjs:lang') as 'ja' | 'en' | null;
    if (stored === 'ja' || stored === 'en') {
      lang.value = stored;
    }
  });

  watch(lang, (val) => {
    if (import.meta.client) {
      localStorage.setItem('vfjs:lang', val);
      document.documentElement.lang = val;
    }
  });

  const setLang = (l: 'ja' | 'en') => {
    lang.value = l;
  };
  const t = computed(() => translations[lang.value]);

  return { lang, setLang, t };
};
