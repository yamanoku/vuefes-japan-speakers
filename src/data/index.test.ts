import { describe, expect, it } from "vite-plus/test";
import { YEARS } from "../../types";
import { getSpeakerNames, getSpeakerTalks } from "../composables/speaker";
import { getAllSpeakersWithYear, getSpeakersByYear } from "./index";

describe("speaker data accessors", () => {
  it("年別データを取得できる", () => {
    const speakers = getSpeakersByYear("2024");

    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers.every((speaker) => Array.isArray(speaker.name))).toBe(true);
  });

  it("全件データにyearを付与する", () => {
    const speakers = getAllSpeakersWithYear();

    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers.every((speaker) => YEARS.includes(speaker.year))).toBe(true);
  });

  it("うしろのこは ushironoko と同一人物として集約される", () => {
    const talks = getSpeakerTalks("うしろのこ");
    const years = talks.map((talk) => talk.year);

    expect(years).toEqual(expect.arrayContaining(["2022", "2023", "2026"]));
    expect(getSpeakerNames()).not.toContain("ushironoko");
    expect(getSpeakerTalks("ushironoko")).toEqual([]);
  });
});
