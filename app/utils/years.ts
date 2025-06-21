import type { AcceptedYear } from '~~/types';

export const getAvailableYears = (): AcceptedYear[] => {
  return ['2018', '2019', '2022', '2023', '2024'];
};

export const isValidYear = (year: string): year is AcceptedYear => {
  return getAvailableYears().includes(year as AcceptedYear);
};