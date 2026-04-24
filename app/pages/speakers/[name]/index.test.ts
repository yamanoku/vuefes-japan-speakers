import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import type { AcceptedYear, SpeakerInfo } from '~~/types';
// @ts-expect-error type declarations
import SpeakerNamePage from './index.vue';

import { useFetchSpeaker } from '~/composables/speaker';

type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };

const { useHeadMock, useRouteMock, useVfjsI18nMock } = vi.hoisted(() => ({
  useHeadMock: vi.fn(),
  useRouteMock: vi.fn(),
  useVfjsI18nMock: vi.fn(),
}));

mockNuxtImport('useHead', () => useHeadMock);
mockNuxtImport('useRoute', () => useRouteMock);
mockNuxtImport('useVfjsI18n', () => useVfjsI18nMock);

vi.mock('~/composables/speaker', () => ({
  useFetchSpeaker: vi.fn(),
}));

const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  AppHeader: { template: '<div />' },
  AppFooter: { template: '<div />' },
};

describe('speakers/[name]/index.vue', () => {
  const mockSpeakers: SpeakerWithYear[] = [
    {
      year: '2024' as AcceptedYear,
      name: ['John Doe'],
      title: 'Vue.js Advanced',
      url: 'https://example.com/talk1',
    },
    {
      year: '2023' as AcceptedYear,
      name: ['John Doe'],
      title: 'Nuxt 3 Deep Dive',
      url: 'https://example.com/talk2',
    },
  ];

  const mockRoute = { params: { name: 'John Doe' }, matched: [] };

  beforeEach(() => {
    vi.clearAllMocks();
    useRouteMock.mockReturnValue(mockRoute);
    useVfjsI18nMock.mockReturnValue({
      t: computed(() => ({
        appearance_count: (n: number) => `${n}回登壇`,
        years_appeared: '登壇年',
        related_talks: '発表一覧',
        tbd: 'タイトル未定',
        external: '外部リンク',
        back_top: 'TOPページに戻る',
      })),
      lang: ref('ja'),
      setLang: vi.fn(),
    });
    vi.mocked(useFetchSpeaker).mockResolvedValue({
      filterYearSpeaker: undefined,
      filterNameSpeaker: computed(() => mockSpeakers),
    });
  });

  it('スピーカー名とトークを含むページをレンダリングする', async () => {
    const wrapper = await mountSuspended(SpeakerNamePage, {
      route: '/speakers/John%20Doe',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('John Doe');
    expect(html).toContain('Vue.js Advanced');
    expect(html).toContain('Nuxt 3 Deep Dive');
    expect(html).toContain('2024');
    expect(html).toContain('2023');
  });

  describe('SEOとメタデータ', () => {
    it('useHeadでタイトルが設定される', async () => {
      await mountSuspended(SpeakerNamePage, {
        route: '/speakers/John%20Doe',
        global: { stubs: globalStubs },
      });

      expect(useHeadMock).toHaveBeenCalledWith({
        title: 'John Doe 発表一覧',
      });
    });
  });

  describe('異なるスピーカー名', () => {
    it('日本語のスピーカー名を処理する', async () => {
      useRouteMock.mockReturnValue({ params: { name: '山田太郎' }, matched: [] });

      const speakersJapanese: SpeakerWithYear[] = [
        {
          year: '2024' as AcceptedYear,
          name: ['山田太郎'],
          title: 'Vue.jsの基礎',
          url: 'https://example.com/jp1',
        },
      ];

      vi.mocked(useFetchSpeaker).mockResolvedValue({
        filterYearSpeaker: undefined,
        filterNameSpeaker: computed(() => speakersJapanese),
      });

      const wrapper = await mountSuspended(SpeakerNamePage, {
        route: '/speakers/%E5%B1%B1%E7%94%B0%E5%A4%AA%E9%83%8E',
        global: { stubs: globalStubs },
      });

      const html = wrapper.html();
      expect(html).toContain('山田太郎');
      expect(html).toContain('Vue.jsの基礎');
      expect(useHeadMock).toHaveBeenCalledWith({
        title: '山田太郎 発表一覧',
      });
    });
  });
});
