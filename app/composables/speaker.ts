import type { SpeakerInfo, AcceptedYear, SpeakerWithYear } from '~~/types';
import { isValidYear } from '~/utils/years';

const ALL_SPEAKERS_KEY = 'vfjs:all-speakers';

const normalize = (s: string) => s.toLowerCase().trim();

const fetchYearSpeakers = async (year: string) => {
  const { data } = await useFetch<SpeakerInfo[]>(`/api/speakers/${year}`);
  return { filterYearSpeaker: data, filterNameSpeaker: undefined };
};

const fetchAllSpeakersWithYears = async () => {
  const { data } = await useAsyncData(ALL_SPEAKERS_KEY, () =>
    $fetch<SpeakerWithYear[]>(`/api/speakers`),
  );
  return data.value ?? [];
};

const fetchNameSpeakers = async (name?: string) => {
  const allSpeakers = await fetchAllSpeakersWithYears();

  const filterNameSpeaker = computed(() => {
    if (!name) return [];
    const searchTerm = normalize(name);
    const results = allSpeakers.filter((speaker) =>
      speaker.name.some((speakerName) => normalize(speakerName) === searchTerm),
    );
    return results;
  });
  return { filterYearSpeaker: undefined, filterNameSpeaker };
};

export const useFetchSpeaker = async (params?: string) => {
  if (!params) {
    return fetchNameSpeakers('');
  }
  const handler = isValidYear(params) ? fetchYearSpeakers : fetchNameSpeakers;
  return handler(params);
};

export const useFetchAllSpeakers = () =>
  useAsyncData(ALL_SPEAKERS_KEY, () => $fetch<SpeakerWithYear[]>(`/api/speakers`), {
    default: () => [],
  });

export const useFilteredSpeakers = (
  allSpeakers: Ref<SpeakerWithYear[]>,
  selectedYear: Ref<AcceptedYear | 'all'>,
) => {
  return computed(() => {
    if (selectedYear.value === 'all') {
      return allSpeakers.value;
    }
    return allSpeakers.value.filter((speaker) => speaker.year === selectedYear.value);
  });
};
