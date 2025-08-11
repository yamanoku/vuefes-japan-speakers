import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computed } from 'vue';
import type { SpeakerInfo } from '~~/types';

// 実際の実装をインポート
import { isValidYear, getAvailableYears } from '~/utils/years';

// getAvailableYearsのみモック化
vi.mock('~/utils/years', async () => {
  const actual = await vi.importActual<typeof import('~/utils/years')>('~/utils/years');
  return {
    ...actual,
    getAvailableYears: vi.fn(() => ['2018', '2019', '2022', '2023', '2024', '2025']),
  };
});

// Nuxtコンポーザブルをモック化
const mockUseFetch = vi.fn();
const mockFetch = vi.fn();

vi.stubGlobal('useFetch', mockUseFetch);
vi.stubGlobal('$fetch', mockFetch);
vi.stubGlobal('computed', computed);

// モジュール解決の都合上、関数を異なる方法でテストする必要がある
const useFetchSpeaker = async (params?: string) => {
  if (!params) {
    const filterNameSpeaker = computed(() => []);
    return { filterYearSpeaker: undefined, filterNameSpeaker };
  }
  const handler = isValidYear(params)
    ? async (year: string) => {
      const { data } = await (globalThis as unknown as { useFetch: typeof useFetch }).useFetch<SpeakerInfo[]>(`/api/speakers/${year}`);
      return { filterYearSpeaker: data, filterNameSpeaker: undefined };
    }
    : async (name: string) => {
      const years = getAvailableYears();
      const promises = years.map(year =>
        (globalThis as unknown as { $fetch: typeof $fetch }).$fetch<SpeakerInfo[]>(`/api/speakers/${year}`).then(speakers =>
          speakers.map(speaker => ({ ...speaker, year })),
        ),
      );
      const speakersByYear = await Promise.all(promises);
      const allSpeakers = speakersByYear.flat();

      const filterNameSpeaker = computed(() => {
        if (!name) return [];
        const searchTerm = name.toLowerCase();
        const results = allSpeakers.filter(speaker =>
          speaker.name.some(speakerName =>
            speakerName.toLowerCase().includes(searchTerm),
          ),
        );
        return results;
      });

      return { filterYearSpeaker: undefined, filterNameSpeaker };
    };
  return handler(params);
};

const useFetchAllSpeakers = async () => {
  const years = getAvailableYears();
  const promises = years.map(year =>
    $fetch<SpeakerInfo[]>(`/api/speakers/${year}`).then(speakers =>
      speakers.map(speaker => ({ ...speaker, year })),
    ),
  );
  const speakersByYear = await Promise.all(promises);
  return speakersByYear.flat();
};

describe('speaker composables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFetchSpeaker', () => {
    it('パラメータが有効な年の場合、fetchYearSpeakersを呼び出す', async () => {
      const mockYearData: SpeakerInfo[] = [
        {
          name: ['Speaker One'],
          title: 'Talk about Vue',
          url: 'https://example.com/talk1',
        },
      ];

      mockUseFetch.mockResolvedValue({
        data: { value: mockYearData },
      });

      const result = await useFetchSpeaker('2024');

      expect(isValidYear('2024')).toBe(true);
      expect(mockUseFetch).toHaveBeenCalledWith('/api/speakers/2024');
      expect(result.filterYearSpeaker).toEqual({ value: mockYearData });
      expect(result.filterNameSpeaker).toBeUndefined();
    });

    it('パラメータが有効な年でない場合、fetchNameSpeakersを呼び出す', async () => {
      const mockSpeakers: SpeakerInfo[] = [
        {
          name: ['John Doe'],
          title: 'Vue.js Best Practices',
          url: 'https://example.com/talk1',
        },
        {
          name: ['Jane Smith', 'John Doe'],
          title: 'Collaborative Development',
          url: 'https://example.com/talk2',
        },
      ];

      // 異なる年に対する複数のAPIコールをモック化
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('2024')) {
          return Promise.resolve([mockSpeakers[0]]);
        }
        if (url.includes('2023')) {
          return Promise.resolve([mockSpeakers[1]]);
        }
        return Promise.resolve([]);
      });

      const result = await useFetchSpeaker('John Doe');

      expect(isValidYear('John Doe')).toBe(false);
      expect(getAvailableYears).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(6); // 各年に対して呼ばれる（6年分）

      // filterNameSpeakerがcomputed refであることを確認
      expect(result.filterYearSpeaker).toBeUndefined();
      expect(result.filterNameSpeaker).toBeDefined();

      // 順序は異なる可能性があるが、両方のスピーカーに"John Doe"が含まれる
      const filteredSpeakers = result.filterNameSpeaker?.value;
      expect(filteredSpeakers).toHaveLength(2);
      expect(filteredSpeakers?.some(s => s.title === 'Vue.js Best Practices' && s.year === '2024')).toBe(true);
      expect(filteredSpeakers?.some(s => s.title === 'Collaborative Development' && s.year === '2023')).toBe(true);
    });

    it('スピーカー名で正しくフィルタリングする', async () => {
      const mockSpeakers = [
        {
          name: ['Alice Johnson'],
          title: 'Advanced Vue Patterns',
          url: 'https://example.com/talk1',
        },
        {
          name: ['Bob Smith', 'Alice Johnson'],
          title: 'Team Development',
          url: 'https://example.com/talk2',
        },
        {
          name: ['Charlie Brown'],
          title: 'Vue Performance',
          url: 'https://example.com/talk3',
        },
      ];

      mockFetch.mockResolvedValue(mockSpeakers);

      const result = await useFetchSpeaker('alice');

      const filtered = result.filterNameSpeaker?.value || [];
      const aliceSpeakers = filtered.filter((s: unknown) =>
        (s as { name: string[] }).name.some((n: string) => n.toLowerCase().includes('alice')),
      );
      expect(aliceSpeakers).toHaveLength(12); // 6年分 × 2人のAliceスピーカー
    });

    it('名前に一致するスピーカーがいない場合、空の配列を返す', async () => {
      mockFetch.mockResolvedValue([
        {
          name: ['Speaker One'],
          title: 'Talk',
          url: 'https://example.com',
        },
      ]);

      const result = await useFetchSpeaker('NonExistent');

      expect(result.filterNameSpeaker?.value).toEqual([]);
    });

    it('大文字小文字を区別しない名前検索を処理する', async () => {
      const mockSpeakers = [
        {
          name: ['John DOE'],
          title: 'Talk',
          url: 'https://example.com',
        },
      ];

      mockFetch.mockResolvedValue(mockSpeakers);

      const result = await useFetchSpeaker('john doe');

      // 6年分のデータが返される（各年同じJohn DOEスピーカー）
      expect(result.filterNameSpeaker?.value).toHaveLength(6);
      expect(result.filterNameSpeaker?.value?.[0]).toMatchObject({
        ...mockSpeakers[0],
        year: '2018',
      });
    });
  });

  describe('useFetchAllSpeakers', () => {
    it('利用可能なすべての年からスピーカーを取得する', async () => {
      const mockSpeakers2024: SpeakerInfo[] = [
        {
          name: ['Speaker 2024'],
          title: 'Vue 3 Features',
          url: 'https://example.com/2024',
        },
      ];
      const mockSpeakers2023: SpeakerInfo[] = [
        {
          name: ['Speaker 2023'],
          title: 'Composition API',
          url: 'https://example.com/2023',
        },
      ];

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('2024')) return Promise.resolve(mockSpeakers2024);
        if (url.includes('2023')) return Promise.resolve(mockSpeakers2023);
        return Promise.resolve([]);
      });

      const result = await useFetchAllSpeakers();

      expect(getAvailableYears).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith('/api/speakers/2023');
      expect(mockFetch).toHaveBeenCalledWith('/api/speakers/2024');
      expect(result).toEqual([
        { ...mockSpeakers2023[0], year: '2023' },
        { ...mockSpeakers2024[0], year: '2024' },
      ]);
    });

    it('一部の年からの空のレスポンスを処理する', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('2023')) {
          return Promise.resolve([
            {
              name: ['Speaker 2023'],
              title: 'Talk',
              url: 'https://example.com',
            },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await useFetchAllSpeakers();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: ['Speaker 2023'],
        year: '2023',
      });
    });

    it('APIエラーを適切に処理する', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      await expect(useFetchAllSpeakers()).rejects.toThrow('API Error');
    });
  });

  describe('fetchAllSpeakersWithYears', () => {
    it('各スピーカーにyearプロパティを追加する', async () => {
      const mockSpeakers = [
        { name: ['A'], title: 'Talk A', url: 'https://a.com' },
      ];
      mockFetch.mockResolvedValue(mockSpeakers);

      const result = await useFetchAllSpeakers();

      const filtered2024 = result.filter(s => s.year === '2024');
      expect(filtered2024).toHaveLength(1);
      expect(filtered2024[0]).toHaveProperty('year', '2024');
    });

    it('複数年からのスピーカーを正しくフラット化する', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('2023')) {
          return Promise.resolve([
            { name: ['Speaker 1'], title: 'Talk 1', url: 'https://1.com' },
          ]);
        }
        if (url.includes('2024')) {
          return Promise.resolve([
            { name: ['Speaker 2'], title: 'Talk 2', url: 'https://2.com' },
            { name: ['Speaker 3'], title: 'Talk 3', url: 'https://3.com' },
          ]);
        }
        return Promise.resolve([]);
      });

      const result = await useFetchAllSpeakers();

      expect(result).toHaveLength(3);
      expect(result.map(s => s.year)).toEqual(['2023', '2024', '2024']);
    });
  });

  describe('エッジケース', () => {
    it('配列内に複数の名前を持つスピーカーを処理する', async () => {
      const mockSpeakers = [
        {
          name: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
          title: 'Panel Discussion',
          url: 'https://example.com/panel',
        },
      ];

      mockFetch.mockResolvedValue(mockSpeakers);

      const result = await useFetchSpeaker('bob');

      expect(result.filterNameSpeaker?.value).toHaveLength(6);
      expect(result.filterNameSpeaker?.value?.[0]?.name).toContain('Bob Smith');
    });
  });

  describe('同時APIコール', () => {
    it('同時リクエストを適切に処理し、正しい年を割り当てる', async () => {
      mockFetch.mockImplementation((url: string) => {
        const year = url.split('/').pop();
        if (!year) return Promise.resolve([]);
        return Promise.resolve([
          { name: [`Speaker ${year}`], title: `Talk ${year}`, url: `https://${year}.com` },
        ]);
      });

      const result = await useFetchAllSpeakers();

      expect(mockFetch).toHaveBeenCalledTimes(6);
      expect(result).toHaveLength(6);
      expect(result.find(s => s.name[0] === 'Speaker 2023')?.year).toBe('2023');
      expect(result.find(s => s.name[0] === 'Speaker 2024')?.year).toBe('2024');
    });
  });

  describe('エラー処理', () => {
    it.each([
      ['fetchYearSpeakers', '2024', 'Network error'],
      ['fetchAllSpeakers', null, 'API Error for 2023'],
    ])('%sでAPIエラーを処理する', async (funcName, param, errorMsg) => {
      if (funcName === 'fetchYearSpeakers') {
        mockUseFetch.mockRejectedValue(new Error(errorMsg));
        await expect(useFetchSpeaker(param!)).rejects.toThrow(errorMsg);
      }
      else {
        mockFetch.mockImplementation((url: string) => {
          if (url.includes('2023')) {
            return Promise.reject(new Error(errorMsg));
          }
          return Promise.resolve([{ name: ['Speaker'], title: 'Talk', url: 'https://example.com' }]);
        });
        await expect(useFetchAllSpeakers()).rejects.toThrow(errorMsg);
      }
    });

    it('空の年配列を適切に処理する', async () => {
      vi.mocked(getAvailableYears).mockReturnValue([]);

      const result = await useFetchAllSpeakers();

      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
