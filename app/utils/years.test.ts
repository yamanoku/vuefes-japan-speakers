import { describe, it, expect } from 'vitest';
import { isValidYear } from './years';
import type { AcceptedYear } from '~~/types';

describe('isValidYear', () => {
  describe('有効な年', () => {
    it.each([
      ['2018'],
      ['2019'],
      ['2022'],
      ['2023'],
      ['2024'],
      ['2025'],
    ])('%sの場合trueを返す', (year) => {
      expect(isValidYear(year)).toBe(true);
    });
  });

  describe('無効な年', () => {
    it.each([
      ['2020'],
      ['2021'],
      ['2100'],
    ])('%sの場合falseを返す', (year) => {
      expect(isValidYear(year)).toBe(false);
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
