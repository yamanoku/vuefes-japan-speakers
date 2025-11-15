import { YEARS } from '~~/types';

export default defineCachedEventHandler(
  () => {
    return {
      years: YEARS,
      count: YEARS.length,
    };
  },
  {
    maxAge: 60 * 60 * 24, // 24 hours cache
  },
);
