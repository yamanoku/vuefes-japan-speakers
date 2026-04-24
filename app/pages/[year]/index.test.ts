import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
// @ts-expect-error type declarations
import YearPage from './index.vue';

import { useFetchSpeaker } from '~/composables/speaker';

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

describe('[year]/index.vue', () => {
  const mockSpeakers = [
    {
      year: '2024',
      name: ['John Doe', 'Jane Smith'],
      title: 'Vue.js Advanced',
      url: 'https://example.com/talk1',
    },
    {
      year: '2024',
      name: ['Alice Johnson'],
      title: 'Nuxt 3 Deep Dive',
      url: 'https://example.com/talk2',
    },
    {
      year: '2024',
      name: ['Bob Wilson'],
      title: 'Composition API Best Practices',
      url: 'https://example.com/talk3',
    },
  ];

  const mockRoute = { params: { year: '2024' }, matched: [] };

  beforeEach(() => {
    vi.clearAllMocks();
    useRouteMock.mockReturnValue(mockRoute);
    useVfjsI18nMock.mockReturnValue({
      t: computed(() => ({
        year_total_talks: (n: number) => `全 ${n} 発表`,
        official_site: '公式サイト',
        tbd: 'タイトル未定',
        external: '外部リンク',
        back_top: 'TOPページに戻る',
      })),
      lang: ref('ja'),
      setLang: vi.fn(),
    });
    vi.mocked(useFetchSpeaker).mockResolvedValue({
      filterYearSpeaker: ref([]),
      filterNameSpeaker: undefined,
    });
  });

  it('年タイトルとスピーカーリストをレンダリングする', async () => {
    vi.mocked(useFetchSpeaker).mockResolvedValue({
      filterYearSpeaker: ref(mockSpeakers),
      filterNameSpeaker: undefined,
    });

    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('Vue Fes Japan');
    expect(html).toContain('2024');
    expect(html).toContain('公式サイト');
    expect(html).toContain('John Doe');
    expect(html).toContain('Vue.js Advanced');
    expect(html).toContain('Alice Johnson');
    expect(html).toContain('Nuxt 3 Deep Dive');
  });

  it('スピーカーが空の場合でもページをレンダリングする', async () => {
    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('Vue Fes Japan');
    expect(html).toContain('2024');
  });

  it('正しい年パラメータでuseFetchSpeakerを呼び出す', async () => {
    await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    expect(useFetchSpeaker).toHaveBeenCalledWith('2024');
  });

  it('useHeadでタイトルが設定される', async () => {
    await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    expect(useHeadMock).toHaveBeenCalledWith({ title: 'Vue Fes Japan 2024' });
  });
});
