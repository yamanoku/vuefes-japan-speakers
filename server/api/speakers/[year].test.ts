import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineEventHandler, getRouterParam, createError } from 'h3';
import type { SpeakerInfo } from '~~/types';
import handler from './[year]';

// Mock dependencies
vi.mock('h3', () => ({
  defineEventHandler: (fn: any) => fn,
  getRouterParam: vi.fn(),
  createError: vi.fn((options) => new Error(options.statusMessage)),
}));

vi.mock('~~/server/data', () => ({
  getSpeakersByYear: vi.fn(),
}));

vi.mock('~/utils/years', () => ({
  isValidYear: vi.fn(),
  getAvailableYears: vi.fn(),
}));

import { getSpeakersByYear } from '~~/server/data';
import { isValidYear, getAvailableYears } from '~/utils/years';

describe('/api/speakers/[year]', () => {
  const mockEvent = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAvailableYears).mockReturnValue(['2018', '2019', '2022', '2023', '2024']);
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
      vi.mocked(isValidYear).mockReturnValue(true);
      vi.mocked(getSpeakersByYear).mockReturnValue(mockSpeakers);

      const result = handler(mockEvent);

      expect(getRouterParam).toHaveBeenCalledWith(mockEvent, 'year');
      expect(isValidYear).toHaveBeenCalledWith('2024');
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
      vi.mocked(isValidYear).mockReturnValue(true);
      vi.mocked(getSpeakersByYear).mockReturnValue(mockSpeakers);

      const result = handler(mockEvent);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockSpeakers);
    });

    it('有効な年にスピーカーが存在しない場合、空の配列を返す', () => {
      vi.mocked(getRouterParam).mockReturnValue('2022');
      vi.mocked(isValidYear).mockReturnValue(true);
      vi.mocked(getSpeakersByYear).mockReturnValue([]);

      const result = handler(mockEvent);

      expect(result).toEqual([]);
    });

    it('すべての有効な年を正しく処理する', () => {
      const years = ['2018', '2019', '2022', '2023', '2024'];

      years.forEach(year => {
        vi.mocked(getRouterParam).mockReturnValue(year);
        vi.mocked(isValidYear).mockReturnValue(true);
        vi.mocked(getSpeakersByYear).mockReturnValue([]);

        const result = handler(mockEvent);

        expect(isValidYear).toHaveBeenCalledWith(year);
        expect(getSpeakersByYear).toHaveBeenCalledWith(year);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('無効な年のリクエスト', () => {
    it('無効な年2020の場合エラーをスローする', () => {
      vi.mocked(getRouterParam).mockReturnValue('2020');
      vi.mocked(isValidYear).mockReturnValue(false);

      expect(() => handler(mockEvent)).toThrow();
      
      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
      expect(getSpeakersByYear).not.toHaveBeenCalled();
    });

    it('数値でない年の場合エラーをスローする', () => {
      vi.mocked(getRouterParam).mockReturnValue('abc');
      vi.mocked(isValidYear).mockReturnValue(false);

      expect(() => handler(mockEvent)).toThrow();
      
      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
    });

    it('空の年パラメータの場合エラーをスローする', () => {
      vi.mocked(getRouterParam).mockReturnValue('');
      vi.mocked(isValidYear).mockReturnValue(false);

      expect(() => handler(mockEvent)).toThrow();
      
      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
    });

    it('nullの年パラメータの場合エラーをスローする', () => {
      vi.mocked(getRouterParam).mockReturnValue(null);

      expect(() => handler(mockEvent)).toThrow();
      
      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
      expect(isValidYear).not.toHaveBeenCalled();
    });

    it('undefinedの年パラメータの場合エラーをスローする', () => {
      vi.mocked(getRouterParam).mockReturnValue(undefined);

      expect(() => handler(mockEvent)).toThrow();
      
      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
    });
  });

  describe('ハンドラーの動作', () => {
    it('同期関数である', () => {
      // The handler should not be async
      expect(handler.constructor.name).not.toBe('AsyncFunction');
    });

    it('データ取得前に年を検証する', () => {
      vi.mocked(getRouterParam).mockReturnValue('invalid');
      vi.mocked(isValidYear).mockReturnValue(false);

      expect(() => handler(mockEvent)).toThrow();

      // Should check validity before trying to get speakers
      expect(isValidYear).toHaveBeenCalled();
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
      vi.mocked(isValidYear).mockReturnValue(true);
      vi.mocked(getSpeakersByYear).mockReturnValue(originalData);

      const result = handler(mockEvent);

      // Should be the exact same reference
      expect(result).toBe(originalData);
    });
  });

  describe('エラーメッセージのフォーマット', () => {
    it('エラーメッセージにすべての利用可能な年を含む', () => {
      vi.mocked(getRouterParam).mockReturnValue('2025');
      vi.mocked(isValidYear).mockReturnValue(false);
      vi.mocked(getAvailableYears).mockReturnValue(['2018', '2019', '2022', '2023', '2024']);

      expect(() => handler(mockEvent)).toThrow();

      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024',
      });
    });

    it('利用可能な年が変更されたときエラーメッセージを更新する', () => {
      vi.mocked(getRouterParam).mockReturnValue('2025');
      vi.mocked(isValidYear).mockReturnValue(false);
      vi.mocked(getAvailableYears).mockReturnValue(['2023', '2024', '2025']);

      expect(() => handler(mockEvent)).toThrow();

      expect(createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2023, 2024, 2025',
      });
    });
  });

  describe('データの一貫性', () => {
    it('一貫したスピーカーデータ形式を返す', () => {
      const speakers: SpeakerInfo[] = [
        {
          name: ['Speaker A'],
          title: 'Talk A',
          url: 'https://a.com',
        },
        {
          name: ['Speaker B', 'Speaker C'],
          url: 'https://b.com',
          // Missing title is valid
        },
      ];

      vi.mocked(getRouterParam).mockReturnValue('2024');
      vi.mocked(isValidYear).mockReturnValue(true);
      vi.mocked(getSpeakersByYear).mockReturnValue(speakers);

      const result = handler(mockEvent);

      result.forEach(speaker => {
        expect(speaker).toHaveProperty('name');
        expect(speaker).toHaveProperty('url');
        expect(Array.isArray(speaker.name)).toBe(true);
        expect(speaker.name.length).toBeGreaterThan(0);
        expect(speaker.url).toMatch(/^https?:\/\//);
      });
    });
  });
});