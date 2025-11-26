import { getAllSpeakersWithYear } from '~~/server/data';

export default defineCachedEventHandler(
  (event) => {
    const query = getQuery(event);
    const searchQuery = query.query as string;

    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query parameter is required',
      });
    }

    const allSpeakers = getAllSpeakersWithYear();
    const searchLower = searchQuery.toLowerCase();

    // Search by speaker name
    const results = allSpeakers.filter(speaker =>
      speaker.name.some(name => name.toLowerCase().includes(searchLower)),
    );

    return results;
  },
  {
    maxAge: 60 * 60, // 1 hour cache
  },
);
