import type { SpeakerWithYear } from '~~/types';
import { getAllSpeakersWithYear } from '~~/server/data';

export default defineEventHandler((): SpeakerWithYear[] => {
  // Return all speakers across all years (no HTTP calls)
  return getAllSpeakersWithYear();
});
