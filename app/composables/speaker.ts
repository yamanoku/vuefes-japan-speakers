import { computed, type Ref } from "vue";
import { getAllSpeakersWithYear, getSpeakersByYear } from "../../server/data";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { compareLexicalJa } from "../utils/stringCollate";

const normalize = (value: string) => value.toLowerCase().trim();

export const getAllSpeakers = (): SpeakerWithYear[] => getAllSpeakersWithYear();

export const getYearSpeakers = (year: AcceptedYear) => getSpeakersByYear(year);

export const getSpeakerTalks = (
  name: string,
  allSpeakers: SpeakerWithYear[] = getAllSpeakersWithYear(),
): SpeakerWithYear[] => {
  const searchTerm = normalize(name);
  return allSpeakers
    .filter((speaker) => speaker.name.some((speakerName) => normalize(speakerName) === searchTerm))
    .sort((left, right) => compareLexicalJa(left.year, right.year));
};

export const getSpeakerNames = (
  allSpeakers: SpeakerWithYear[] = getAllSpeakersWithYear(),
): string[] => {
  const names = new Set<string>();
  for (const speaker of allSpeakers) {
    speaker.name.forEach((name) => names.add(name));
  }
  return [...names].sort(compareLexicalJa);
};

export const useFilteredSpeakers = (
  allSpeakers: Ref<SpeakerWithYear[]>,
  selectedYear: Ref<AcceptedYear | "all">,
) => {
  return computed(() => {
    if (selectedYear.value === "all") {
      return allSpeakers.value;
    }
    return allSpeakers.value.filter((speaker) => speaker.year === selectedYear.value);
  });
};
