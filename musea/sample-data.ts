import type { SpeakerInfo, SpeakerWithYear } from "../types";

export const museaSpeakers = [
  {
    year: "2018",
    name: ["Evan You"],
    nameEn: ["Evan You"],
    title: "Keynote: The State of Vue",
    url: "https://vuefes.jp/2018/",
  },
  {
    year: "2023",
    name: ["Eduardo San Martin Morote"],
    nameEn: ["Eduardo San Martin Morote"],
    title: "Vue Router and the Future of Routing",
    url: "https://vuefes.jp/2023/",
  },
  {
    year: "2024",
    name: ["Daniel Roe"],
    nameEn: ["Daniel Roe"],
    title: "Nuxt and the Vue Ecosystem",
    url: "https://vuefes.jp/2024/",
  },
  {
    year: "2025",
    name: ["山田 太郎"],
    nameRuby: ["やまだ たろう"],
    nameEn: ["Taro Yamada"],
    title: "Vue Fes Japan を支えるデザインシステム",
    url: "https://vuefes.jp/2025/",
  },
  {
    year: "2025",
    name: ["Evan You", "山田 太郎"],
    nameRuby: ["", "やまだ たろう"],
    nameEn: ["Evan You", "Taro Yamada"],
    title: "Vue コミュニティのこれから",
    url: "https://vuefes.jp/2025/",
    format: "panel",
  },
] satisfies SpeakerWithYear[];

export const museaStats = {
  speakers: 4,
  talks: museaSpeakers.length,
  years: 4,
};

export const museaYearSpeakers = museaSpeakers
  .filter((speaker) => speaker.year === "2025")
  .map((speaker) => {
    const speakerInfo: SpeakerInfo = {
      name: speaker.name,
      nameEn: speaker.nameEn,
      title: speaker.title,
      url: speaker.url,
    };
    if (speaker.nameRuby) speakerInfo.nameRuby = speaker.nameRuby;
    if (speaker.format) speakerInfo.format = speaker.format;
    return speakerInfo;
  });

export const museaSpeakerName = "Evan You";

export const museaSpeakerTalks = museaSpeakers.filter((speaker) =>
  speaker.name.includes(museaSpeakerName),
);

export const museaSpeakerOptions = [
  { label: "Evan You", value: "Evan You" },
  { label: "Eduardo San Martin Morote", value: "Eduardo San Martin Morote" },
  { label: "Daniel Roe", value: "Daniel Roe" },
  { label: "山田 太郎", value: "山田 太郎" },
];

export const museaYearCounts: Record<string, number> = {
  all: museaSpeakers.length,
  2018: 1,
  2019: 0,
  2022: 0,
  2023: 1,
  2024: 1,
  2025: 2,
};
