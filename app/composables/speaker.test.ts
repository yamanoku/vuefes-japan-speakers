import { describe, expect, it } from "vite-plus/test";
import { ref } from "vue";
import type { AcceptedYear, SpeakerWithYear } from "../../types";
import { getSpeakerNames, getSpeakerTalks, useFilteredSpeakers } from "./speaker";

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
    expect(getSpeakerTalks("alice johnson", speakers)).toEqual([speakers[0], speakers[1]]);
  });

  it("重複しないスピーカー名を日本語比較で並べる", () => {
    expect(getSpeakerNames(speakers)).toEqual(["Alice Johnson", "Bob Smith", "Charlie Brown"]);
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
