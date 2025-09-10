import type { SpeakerInfo, AcceptedYear, SpeakerWithYear } from '~~/types';
import { isValidYear } from '~/utils/years';

const normalize = (s: string) => s.toLowerCase().trim();

const fetchYearSpeakers = async (year: string) => {
  const { data } = await useFetch<SpeakerInfo[]>(`/api/speakers/${year}`);
  return { filterYearSpeaker: data, filterNameSpeaker: undefined };
};

const fetchAllSpeakersWithYears = async () => {
  // Single call to aggregated API
  const all = await $fetch<SpeakerWithYear[]>(`/api/speakers`);
  return all;
};

const fetchNameSpeakers = async (name?: string) => {
  const allSpeakers = await fetchAllSpeakersWithYears();

  const filterNameSpeaker = computed(() => {
    if (!name) return [];
    const searchTerm = normalize(name);
    const results = allSpeakers.filter(speaker =>
      speaker.name.some(speakerName => normalize(speakerName) === searchTerm),
    );
    return results;
  });
  return { filterYearSpeaker: undefined, filterNameSpeaker };
};

export const useFetchSpeaker = async (params?: string) => {
  if (!params) {
    return fetchNameSpeakers('');
  }
  const handler = isValidYear(params)
    ? fetchYearSpeakers
    : fetchNameSpeakers;
  return handler(params);
};

export const useFetchAllSpeakers = async () => {
  const allSpeakers = await fetchAllSpeakersWithYears();
  return allSpeakers;
};

export const useFilteredSpeakers = (allSpeakers: Ref<SpeakerWithYear[]>, selectedYear: Ref<AcceptedYear | 'all'>) => {
  return computed(() => {
    if (selectedYear.value === 'all') {
      return allSpeakers.value;
    }
    return allSpeakers.value.filter(speaker => speaker.year === selectedYear.value);
  });
};
