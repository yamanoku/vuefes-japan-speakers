import type { SpeakerInfo, AcceptedYear, SpeakerWithYear } from '~~/types';
import { YEARS } from '~~/types';
import { speakers2018 } from './speakers-2018';
import { speakers2019 } from './speakers-2019';
import { speakers2022 } from './speakers-2022';
import { speakers2023 } from './speakers-2023';
import { speakers2024 } from './speakers-2024';
import { speakers2025 } from './speakers-2025';

// Speakers organized by year
const speakersByYear = {
  2018: speakers2018,
  2019: speakers2019,
  2022: speakers2022,
  2023: speakers2023,
  2024: speakers2024,
  2025: speakers2025,
} satisfies Record<AcceptedYear, SpeakerInfo[]>;

// Helper function to get speakers by year
export const getSpeakersByYear = (year: AcceptedYear): SpeakerInfo[] => {
  return speakersByYear[year] || [];
};

export const getAllSpeakersWithYear = (): SpeakerWithYear[] => {
  return YEARS.flatMap(year =>
    (speakersByYear[year] || []).map(s => ({ ...s, year } as SpeakerWithYear)),
  );
};
