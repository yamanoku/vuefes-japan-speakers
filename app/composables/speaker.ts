import type { SpeakerInfo, AcceptedYear } from '~~/types';
import { isValidYear, getAvailableYears } from '~/utils/years';

type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };

const fetchYearSpeakers = async (year: string) => {
  const { data } = await useFetch<SpeakerInfo[]>(`/api/speakers/${year}`);
  return { filterYearSpeaker: data, filterNameSpeaker: undefined };
};

const fetchAllSpeakersWithYears = async () => {
  // Fetch speakers from all years in parallel
  const years = getAvailableYears();
  const promises = years.map(year =>
    $fetch<SpeakerInfo[]>(`/api/speakers/${year}`).then(speakers =>
      speakers.map(speaker => ({ ...speaker, year }))
    )
  );

  const speakersByYear = await Promise.all(promises);
  return speakersByYear.flat() as SpeakerWithYear[];
};

const fetchNameSpeakers = async (name?: string) => {
  const allSpeakers = await fetchAllSpeakersWithYears();

  const filterNameSpeaker = computed(() => {
    if (!name) return [];
    const searchTerm = name.toLowerCase();
    const results = allSpeakers.filter(speaker =>
      speaker.name.some(speakerName => 
        speakerName.toLowerCase().includes(searchTerm)
      )
    );
    return results;
  });
  return { filterYearSpeaker: undefined, filterNameSpeaker };
};

export const useFetchSpeaker = async (params?: string) => {
  const handler = params && isValidYear(params)
    ? fetchYearSpeakers
    : fetchNameSpeakers;
  return handler(params);
};

export const useFetchAllSpeakers = async () => {
  const allSpeakers = await fetchAllSpeakersWithYears();
  return allSpeakers;
};