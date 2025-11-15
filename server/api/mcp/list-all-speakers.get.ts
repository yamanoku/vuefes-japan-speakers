import { getAllSpeakersWithYear } from '~~/server/data';

export default defineCachedEventHandler(
  () => {
    const speakers = getAllSpeakersWithYear();
    return speakers;
  },
  {
    maxAge: 60 * 60, // 1 hour cache
  },
);
