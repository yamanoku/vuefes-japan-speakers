import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRouterParam, createError, type H3Event, type EventHandlerRequest } from 'h3';
import type { SpeakerInfo } from '~~/types';
import handler from './[year]';

import { getSpeakersByYear } from '~~/server/data';
import { isValidYear } from '~/utils/years';

// 依存関係をモック化
vi.mock('h3', () => ({
  defineEventHandler: (fn: unknown) => fn,
  getRouterParam: vi.fn(),
  createError: vi.fn(options => new Error(options.statusMessage)),
}));

vi.mock('~~/server/data', () => ({
  getSpeakersByYear: vi.fn(),
}));

describe('/api/speakers/[year]', () => {
  const mockEvent = {} as unknown as H3Event<EventHandlerRequest>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('有効な年のリクエスト', () => {
    it('2024年のスピーカーを返す', () => {
      const mockSpeakers: SpeakerInfo[] = [
        {
          name: ['Speaker 2024'],
          title: 'Vue 3.4 Features',
          url: 'https://example.com/2024',
        },
      ];

      vi.mocked(getRouterParam).mockReturnValue('2024');
      vi.mocked(getSpeakersByYear).mockReturnValue(mockSpeakers);

      const result = handler(mockEvent);

      expect(getRouterParam).toHaveBeenCalledWith(mockEvent, 'year');
      expect(isValidYear('2024')).toBe(true);
      expect(getSpeakersByYear).toHaveBeenCalledWith('2024');
      expect(result).toEqual(mockSpeakers);
    });

    it('2023年のスピーカーを返す', () => {
      const mockSpeakers: SpeakerInfo[] = [
        {
          name: ['Speaker A', 'Speaker B'],
          title: 'Panel Discussion 2023',
          url: 'https://example.com/panel2023',
        },
        {
          name: ['Speaker C'],
          title: 'Nuxt 3 Introduction',
          url: 'https://example.com/nuxt3',
        },
      ];

      vi.mocked(getRouterParam).mockReturnValue('2023');
      vi.mocked(getSpeakersByYear).mockReturnValue(mockSpeakers);

      const result = handler(mockEvent);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockSpeakers);
    });

    it('有効な年にスピーカーが存在しない場合、空の配列を返す', () => {
      vi.mocked(getRouterParam).mockReturnValue('2022');
      vi.mocked(getSpeakersByYear).mockReturnValue([]);

      const result = handler(mockEvent);

      expect(result).toEqual([]);
    });

    it('すべての有効な年を正しく処理する', () => {
      const years = ['2018', '2019', '2022', '2023', '2024', '2025'];

      years.forEach((year) => {
        vi.mocked(getRouterParam).mockReturnValue(year);
        vi.mocked(getSpeakersByYear).mockReturnValue([]);

        const result = handler(mockEvent);

        expect(isValidYear(year)).toBe(true);
        expect(getSpeakersByYear).toHaveBeenCalledWith(year);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('無効な年のリクエスト', () => {
    it.each([
      '2020', // 無効な年
      'abc', // 数値でない年
      '', // 空のパラメータ
      undefined,
    ])('%sの場合エラーをスローする', (year) => {
      vi.mocked(getRouterParam).mockReturnValue(year);

      expect(() => handler(mockEvent)).toThrow();

      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024, 2025',
      });
      expect(getSpeakersByYear).not.toHaveBeenCalled();
    });
  });

  describe('ハンドラーの動作', () => {
    it('データ取得前に年を検証する', () => {
      vi.mocked(getRouterParam).mockReturnValue('invalid');

      expect(() => handler(mockEvent)).toThrow();

      expect(isValidYear('invalid')).toBe(false);
      expect(getSpeakersByYear).not.toHaveBeenCalled();
    });

    it('返されたスピーカーデータを変更しない', () => {
      const originalData: SpeakerInfo[] = [
        {
          name: ['Test Speaker'],
          title: 'Test Talk',
          url: 'https://test.com',
        },
      ];

      vi.mocked(getRouterParam).mockReturnValue('2024');
      vi.mocked(getSpeakersByYear).mockReturnValue(originalData);

      const result = handler(mockEvent);

      expect(result).toBe(originalData);
    });
  });
});
