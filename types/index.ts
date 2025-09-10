export type SpeakerInfo = {
  name: string[];
  title?: string;
  url: string;
};

export const YEARS = ['2018', '2019', '2022', '2023', '2024', '2025'] as const;
export type AcceptedYear = typeof YEARS[number];

export type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };
