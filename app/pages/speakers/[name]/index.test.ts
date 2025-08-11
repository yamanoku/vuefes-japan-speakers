import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computed } from 'vue';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import type { AcceptedYear, SpeakerInfo } from '~~/types';
import SpeakerNamePage from './index.vue';

// Import mocked functions
import { useFetchSpeaker } from '~/composables/speaker';

type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };

// Create hoisted mocks
const { useSeoMetaMock, useHeadMock, useRouteMock } = vi.hoisted(() => {
  return {
    useSeoMetaMock: vi.fn(),
    useHeadMock: vi.fn(),
    useRouteMock: vi.fn(),
  };
});

// Mock Nuxt imports using mockNuxtImport
mockNuxtImport('useSeoMeta', () => useSeoMetaMock);
mockNuxtImport('useHead', () => useHeadMock);
mockNuxtImport('useRoute', () => useRouteMock);

// Mock dependencies
vi.mock('~/composables/speaker', () => ({
  useFetchSpeaker: vi.fn(),
}));

vi.mock('~/components/SpeakerTable.vue', () => ({
  default: {
    name: 'SpeakerTable',
    props: ['speakers', 'showYear'],
    template: '<div class="speaker-table">{{ speakers?.length || 0 }} speakers{{ showYear ? " with year" : "" }}</div>',
  },
}));

// Global stubs for Nuxt components
const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :to="to"><slot /></a>',
    props: ['to'],
  },
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

  const mockRoute = {
    params: {
      name: 'John Doe',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all mocks
    useSeoMetaMock.mockClear();
    useHeadMock.mockClear();
    useRouteMock.mockClear();

    // Set up route mock
    useRouteMock.mockReturnValue(mockRoute);
    // Set default mock implementation
    vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
      filterYearSpeaker: undefined,
      filterNameSpeaker: computed(() => []),
    }));
  });

  it('スピーカー名とトークを含むページをレンダリングする', async () => {
    vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
      filterYearSpeaker: undefined,
      filterNameSpeaker: computed(() => mockSpeakers),
    }));

    const wrapper = await mountSuspended(SpeakerNamePage, {
      global: {
        stubs: globalStubs,
      },
    });

    // Check if component is rendered
    const html = wrapper.html();
    expect(html).toContain('John Doe 発表一覧');
    expect(html).toContain('TOPページに戻る');

    // Check SpeakerTable component
    const speakerTable = wrapper.findComponent({ name: 'SpeakerTable' });
    expect(speakerTable.exists()).toBe(true);
    // The mock template only shows the count, not the full text
    expect(speakerTable.text()).toContain('2 speakers');
  });

  it('スピーカーが存在しない場合、"Page not found"をレンダリングする', async () => {
    vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
      filterYearSpeaker: undefined,
      filterNameSpeaker: computed(() => []),
    }));

    const wrapper = await mountSuspended(SpeakerNamePage, {
      global: {
        stubs: globalStubs,
      },
    });

    // Check rendered content
    const html = wrapper.html();
    expect(html).toContain('John Doe 発表一覧');
    expect(html).toContain('Page not found');
    expect(html).toContain('TOP');

    // Check that SpeakerTable doesn't exist
    const speakerTable = wrapper.findComponent({ name: 'SpeakerTable' });
    expect(speakerTable.exists()).toBe(false);
  });

  describe('useSeoMeta', () => {
    it('スピーカーが存在する場合、robotsをindexに設定する', async () => {
      vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
        filterYearSpeaker: undefined,
        filterNameSpeaker: computed(() => mockSpeakers),
      }));

      // mountSuspended を使用してNuxtコンテキストでコンポーネントをマウント
      await mountSuspended(SpeakerNamePage, {
        global: {
          stubs: globalStubs,
        },
      });

      // useSeoMetaが呼び出されたかを確認
      expect(useSeoMetaMock).toHaveBeenCalled();

      // useSeoMetaに渡された引数を取得
      const seoMetaArg = useSeoMetaMock.mock.calls[0]?.[0];

      // robotsプロパティが関数の場合は実行して値を取得
      const robotsValue = typeof seoMetaArg.robots === 'function'
        ? seoMetaArg.robots()
        : seoMetaArg.robots;

      // robotsの値が'index'であることを確認
      expect(robotsValue).toBe('index');
    });

    it('スピーカーが存在しない場合、robotsをnoindexに設定する', async () => {
      vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
        filterYearSpeaker: undefined,
        filterNameSpeaker: computed(() => []),
      }));

      // mountSuspended を使用してNuxtコンテキストでコンポーネントをマウント
      await mountSuspended(SpeakerNamePage, {
        global: {
          stubs: globalStubs,
        },
      });

      // useSeoMetaが呼び出されたかを確認
      expect(useSeoMetaMock).toHaveBeenCalled();

      // useSeoMetaに渡された引数を取得
      const seoMetaArg = useSeoMetaMock.mock.calls[0]?.[0];

      // robotsプロパティが関数の場合は実行して値を取得
      const robotsValue = typeof seoMetaArg.robots === 'function'
        ? seoMetaArg.robots()
        : seoMetaArg.robots;

      // robotsの値が'noindex'であることを確認
      expect(robotsValue).toBe('noindex');
    });

    it('useHeadでタイトルが設定される', async () => {
      vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
        filterYearSpeaker: undefined,
        filterNameSpeaker: computed(() => mockSpeakers),
      }));

      await mountSuspended(SpeakerNamePage, {
        global: {
          stubs: globalStubs,
        },
      });

      // useHeadが呼び出されたかを確認
      expect(useHeadMock).toHaveBeenCalled();

      // useHeadに渡された引数を確認
      expect(useHeadMock).toHaveBeenCalledWith({
        title: 'John Doe 発表一覧',
      });
    });
  });

  describe('異なるスピーカー名', () => {
    it('日本語のスピーカー名を処理する', async () => {
      const routeJapanese = { params: { name: '山田太郎' } };
      useRouteMock.mockReturnValue(routeJapanese);

      const speakersJapanese: SpeakerWithYear[] = [
        {
          year: '2024' as AcceptedYear,
          name: ['山田太郎'],
          title: 'Vue.jsの基礎',
          url: 'https://example.com/jp1',
        },
      ];

      vi.mocked(useFetchSpeaker).mockImplementation(() => Promise.resolve({
        filterYearSpeaker: undefined,
        filterNameSpeaker: computed(() => speakersJapanese),
      }));

      const wrapper = await mountSuspended(SpeakerNamePage, {
        global: {
          stubs: globalStubs,
        },
      });

      const html = wrapper.html();
      expect(html).toContain('山田太郎 発表一覧');
      expect(useFetchSpeaker).toHaveBeenCalled();
      expect(useHeadMock).toHaveBeenCalledWith({
        title: '山田太郎 発表一覧',
      });
    });
  });
});
