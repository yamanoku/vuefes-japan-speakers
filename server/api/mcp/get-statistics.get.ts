import { getAllSpeakersWithYear } from '~~/server/data';
import { YEARS } from '~~/types';

export default defineCachedEventHandler(
  () => {
    const allSpeakers = getAllSpeakersWithYear();

    // Count speakers by year
    const speakersByYear = YEARS.reduce(
      (acc, year) => {
        acc[year] = allSpeakers.filter(s => s.year === year).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Find repeat speakers
    const speakerCounts = new Map<string, { count: number; years: string[] }>();
    allSpeakers.forEach((speaker) => {
      speaker.name.forEach((name) => {
        const existing = speakerCounts.get(name);
        if (existing) {
          existing.count++;
          existing.years.push(speaker.year);
        }
        else {
          speakerCounts.set(name, { count: 1, years: [speaker.year] });
        }
      });
    });

    const repeatSpeakers = Array.from(speakerCounts.entries())
      .filter(([_, data]) => data.count > 1)
      .map(([name, data]) => ({
        name,
        count: data.count,
        years: data.years,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSpeakers: allSpeakers.length,
      uniqueSpeakers: speakerCounts.size,
      speakersByYear,
      repeatSpeakers,
      years: YEARS,
    };
  },
  {
    maxAge: 60 * 60, // 1 hour cache
  },
);
