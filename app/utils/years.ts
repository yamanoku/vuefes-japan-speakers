import { YEARS } from '~~/types';
import type { AcceptedYear } from '~~/types';

export const getAvailableYears = (): readonly AcceptedYear[] => YEARS;

export const isValidYear = (year: string): year is AcceptedYear => {
  // Cast YEARS to readonly string[] for includes check
  return (YEARS as readonly string[]).includes(year);
};
