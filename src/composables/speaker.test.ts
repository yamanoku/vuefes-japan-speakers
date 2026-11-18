import { describe, expect, it } from "vite-plus/test";
import { ref } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { getSpeakersByYear } from "../data";
import {
  getAllSpeakers,
  getSpeakerNames,
  getSpeakerTalks,
  getYearSpeakers,
  useFilteredSpeakers,
} from "./speaker";

const speakers: SpeakerWithYear[] = [
  {
    name: ["Alice Johnson"],
    title: "Advanced Vue Patterns",
    url: "https://example.com/talk1",
    year: "2023",
  },
  {
    name: ["Bob Smith", "Alice Johnson"],
    title: "Team Development",
    url: "https://example.com/talk2",
    year: "2024",
  },
  {
    name: ["Charlie Brown"],
    title: "Vue Performance",
    url: "https://example.com/talk3",
    year: "2025",
  },
];

describe("speaker helpers", () => {
  it("スピーカー名に完全一致する発表を年順で返す", () => {
    const unordered: SpeakerWithYear[] = [
      {
        name: ["Zoe"],
        title: "Later",
        url: "https://example.com/later",
        year: "2025",
      },
      {
        name: ["Zoe"],
        title: "Earlier",
        url: "https://example.com/earlier",
        year: "2023",
      },
    ];

    expect(getSpeakerTalks("  zOe  ", unordered).map((speaker) => speaker.year)).toEqual([
      "2023",
      "2025",
    ]);
    expect(getSpeakerTalks("alice johnson", speakers)).toEqual([speakers[0], speakers[1]]);
  });

  it("ß と ss は同一の名前として扱わない", () => {
    const eszett: SpeakerWithYear = {
      name: ["ß"],
      title: "Eszett",
      url: "https://example.com/eszett",
      year: "2024",
    };

    expect(getSpeakerTalks("ß", [eszett])).toEqual([eszett]);
    expect(getSpeakerTalks("ss", [eszett])).toEqual([]);
  });

  it("重複しないスピーカー名を日本語比較で並べる", () => {
    const unordered: SpeakerWithYear[] = [
      { name: ["Zoe"], title: "Z", url: "https://example.com/z", year: "2024" },
      { name: ["Amy"], title: "A", url: "https://example.com/a", year: "2024" },
    ];

    expect(getSpeakerNames(unordered)).toEqual(["Amy", "Zoe"]);
    expect(getSpeakerNames(speakers)).toEqual(["Alice Johnson", "Bob Smith", "Charlie Brown"]);
  });

  it("引数を省くと収録データを返す", () => {
    expect(getAllSpeakers().length).toBeGreaterThan(0);
    expect(getYearSpeakers("2025")).toEqual(getSpeakersByYear("2025"));
    expect(getSpeakerTalks("やまのく").length).toBeGreaterThan(0);
  });

  it("selectedYearがallの場合、全てのスピーカーを返す", () => {
    const allSpeakers = ref(speakers);
    const selectedYear = ref<AcceptedYear | "all">("all");

    const filteredSpeakers = useFilteredSpeakers(allSpeakers, selectedYear);

    expect(filteredSpeakers.value).toEqual(speakers);
  });

  it("特定の年が選択された場合、その年のスピーカーのみを返す", () => {
    const allSpeakers = ref(speakers);
    const selectedYear = ref<AcceptedYear | "all">("2024");

    const filteredSpeakers = useFilteredSpeakers(allSpeakers, selectedYear);

    expect(filteredSpeakers.value).toEqual([speakers[1]]);
  });
});
