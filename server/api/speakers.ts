import type { SpeakerInfo } from '~~/types';
import { useFetchAllSpeakers } from '~/composables/speaker';

export default defineEventHandler(async (): SpeakerInfo[] => {
  // Fetch all speakers with year information
  const allSpeakers = await useFetchAllSpeakers();
  return allSpeakers;
});
