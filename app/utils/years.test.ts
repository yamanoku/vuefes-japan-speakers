import { describe, it, expect } from 'vitest';
import { isValidYear } from './years';
import type { AcceptedYear } from '~~/types';

describe('isValidYear', () => {
  describe('有効な年', () => {
    it('2018の場合trueを返す', () => {
      expect(isValidYear('2018')).toBe(true);
    });

    it('2019の場合trueを返す', () => {
      expect(isValidYear('2019')).toBe(true);
    });

    it('2022の場合trueを返す', () => {
      expect(isValidYear('2022')).toBe(true);
    });

    it('2023の場合trueを返す', () => {
      expect(isValidYear('2023')).toBe(true);
    });

    it('2024の場合trueを返す', () => {
      expect(isValidYear('2024')).toBe(true);
    });

    it('2025の場合trueを返す', () => {
      expect(isValidYear('2025')).toBe(true);
    });
  });

  describe('無効な年', () => {
    it('2020の場合falseを返す', () => {
      expect(isValidYear('2020')).toBe(false);
    });

    it('2021の場合falseを返す', () => {
      expect(isValidYear('2021')).toBe(false);
    });

    it('未来の年2100の場合falseを返す', () => {
      expect(isValidYear('2100')).toBe(false);
    });
  });

  describe('型ガードの動作', () => {
    it('trueの場合、型をAcceptedYearに絞り込む', () => {
      const testYear: string = '2024';

      if (isValidYear(testYear)) {
        // TypeScript should now treat testYear as AcceptedYear
        const acceptedYear: AcceptedYear = testYear;
        expect(acceptedYear).toBe('2024');
      }
      else {
        expect.fail('Should have been a valid year');
      }
    });

    it('型ガードが関数の使用で正しく動作する', () => {
      const processYear = (year: AcceptedYear): string => {
        return `Processing year ${year}`;
      };

      const testYear = '2024';

      if (isValidYear(testYear)) {
        expect(processYear(testYear)).toBe('Processing year 2024');
      }
      else {
        expect.fail('Should have been a valid year');
      }
    });
  });
});
