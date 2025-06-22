import type { SpeakerInfo } from '~~/types';
import { getSpeakersByYear } from '~~/server/data';
import { isValidYear, getAvailableYears } from '~/utils/years';
import { defineEventHandler, getRouterParam, createError } from 'h3';

export default defineEventHandler((event): SpeakerInfo[] => {
  const year = getRouterParam(event, 'year');

  // Validate year parameter
  if (!year || !isValidYear(year)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid year parameter. Accepted years are: ${getAvailableYears().join(', ')}`,
    });
  }

  // Return speakers for the specific year
  return getSpeakersByYear(year);
});