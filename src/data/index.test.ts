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

  it("やまのくの英語名を yamanoku として持つ", () => {
    const speakers = getAllSpeakersWithYear().filter((speaker) =>
      speaker.name.includes("やまのく"),
    );

    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers.every((speaker) => speaker.nameEn?.includes("yamanoku"))).toBe(true);
  });

  it("漢字の日本人名は名字と名前を半角スペースで区切る", () => {
    const names = [...new Set(getAllSpeakersWithYear().flatMap((speaker) => speaker.name))];
    const familyGiven = /^[\u4e00-\u9fff]+ [\u4e00-\u9fff]+$/;

    for (const name of names) {
      const kanjiOnly = name.replace(/[^\u4e00-\u9fff]/gu, "");
      const hasNonKanji = /[^\u4e00-\u9fff\s]/u.test(name);
      if (hasNonKanji) continue;
      if (/\s/u.test(name) || kanjiOnly.length >= 3) {
        expect(name, name).toMatch(familyGiven);
      }
    }
  });

  it("ナイトウコウスケは公式表記のまま残す", () => {
    const names = [...new Set(getAllSpeakersWithYear().flatMap((speaker) => speaker.name))];

    expect(names).toContain("ナイトウコウスケ");
  });

  it("表記を揃えた登壇者は年をまたいで同一人物になる", () => {
    const yearsOf = (name: string) =>
      getAllSpeakersWithYear()
        .filter((speaker) => speaker.name.includes(name))
        .map((speaker) => speaker.year)
        .sort();

    expect(yearsOf("永井 優斗")).toEqual(["2024", "2025", "2026"]);
    expect(yearsOf("辻 佳佑")).toEqual(["2024", "2026"]);
    expect(yearsOf("篠田 貴大")).toEqual(["2023", "2026"]);
  });
});
