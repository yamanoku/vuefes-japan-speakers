import { getSpeakersByYear } from '~~/server/data';
import { isValidYear } from '~/utils/years';
import type { AcceptedYear } from '~~/types';

export default defineCachedEventHandler(
  (event) => {
    const query = getQuery(event);
    const year = query.year as string;

    if (!year || !isValidYear(year)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid year parameter. Accepted years are: 2018, 2019, 2022, 2023, 2024, 2025',
      });
    }

    const speakers = getSpeakersByYear(year as AcceptedYear);
    return speakers;
  },
  {
    maxAge: 60 * 60, // 1 hour cache
  },
);
