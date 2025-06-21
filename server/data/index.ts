import type { SpeakerInfo, AcceptedYear } from '~~/types';
import { speakers2018 } from './speakers-2018';
import { speakers2019 } from './speakers-2019';
import { speakers2022 } from './speakers-2022';
import { speakers2023 } from './speakers-2023';
import { speakers2024 } from './speakers-2024';

// Export individual year data
export { speakers2018, speakers2019, speakers2022, speakers2023, speakers2024 };

// Export speakers organized by year
export const speakersByYear: Record<AcceptedYear, SpeakerInfo[]> = {
  '2018': speakers2018,
  '2019': speakers2019,
  '2022': speakers2022,
  '2023': speakers2023,
  '2024': speakers2024,
};

// Helper function to get speakers by year
export const getSpeakersByYear = (year: AcceptedYear): SpeakerInfo[] => {
  return speakersByYear[year] || [];
};

// Helper function to get all available years
export const getAvailableYears = (): AcceptedYear[] => {
  return ['2018', '2019', '2022', '2023', '2024'];
};
