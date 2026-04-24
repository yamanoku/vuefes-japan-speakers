import { describe, it, expect } from 'vite-plus/test';
import type { H3Event, EventHandlerRequest } from 'h3';
import { getSpeakersByYear } from '~~/server/data';
import { isValidYear } from '~/utils/years';
import handler from './[year]';

const createEvent = (year: string | undefined) =>
  ({
    context: {
      params: { year },
    },
  }) as unknown as H3Event<EventHandlerRequest>;

const invalidYearMessage =
  'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024, 2025';

describe('/api/speakers/[year]', () => {
  describe('有効な年のリクエスト', () => {
    it('2024年のスピーカーを返す', () => {
      const result = handler(createEvent('2024'));

      expect(isValidYear('2024')).toBe(true);
      expect(result).toEqual(getSpeakersByYear('2024'));
    });

    it('2023年のスピーカーを返す', () => {
      const result = handler(createEvent('2023'));

      expect(result).toHaveLength(getSpeakersByYear('2023').length);
      expect(result).toEqual(getSpeakersByYear('2023'));
    });

    it('有効な年にスピーカーが存在しない場合、空の配列を返す', () => {
      const result = handler(createEvent('2022'));

      expect(result).toEqual(getSpeakersByYear('2022'));
    });

    it('すべての有効な年を正しく処理する', () => {
      const years = ['2018', '2019', '2022', '2023', '2024', '2025'] as const;

      years.forEach((year) => {
        const result = handler(createEvent(year));

        expect(isValidYear(year)).toBe(true);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual(getSpeakersByYear(year));
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
      expect(() => handler(createEvent(year))).toThrow(invalidYearMessage);
    });
  });

  describe('ハンドラーの動作', () => {
    it('データ取得前に年を検証する', () => {
      expect(() => handler(createEvent('invalid'))).toThrow(invalidYearMessage);
      expect(isValidYear('invalid')).toBe(false);
    });

    it('返されたスピーカーデータを変更しない', () => {
      const originalData = getSpeakersByYear('2024');
      const result = handler(createEvent('2024'));

      expect(result).toBe(originalData);
    });
  });
});
