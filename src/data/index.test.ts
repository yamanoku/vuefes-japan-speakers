import { describe, expect, it } from "vite-plus/test";
import { YEARS } from "../../types";
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
});
