import type { SpeakerWithYear } from '~~/types';
import { getAllSpeakersWithYear } from '~~/server/data';
import { defineEventHandler } from 'h3';

export default defineEventHandler((): SpeakerWithYear[] => {
  // Return all speakers across all years (no HTTP calls)
  return getAllSpeakersWithYear();
});
