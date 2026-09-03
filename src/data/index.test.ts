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

  it("2026の更新された発表タイトルを持つ", () => {
    const speakers = getSpeakersByYear("2026");
    const byName = (name: string) => speakers.find((speaker) => speaker.name.length === 1 && speaker.name[0] === name);
    const panel = speakers.find((speaker) => speaker.format === "panel");

    expect(byName("Eduardo San Martin Morote")?.title).toBe("Type-Safe URLs");
    expect(byName("Charles Wang")?.title).toBe("Vite Task’s Cache Magic");
    expect(byName("中野 美咲")?.title).toBe("ブランドのためのWebGLアニメーション（仮）");
    expect(panel?.title).toBe("JavaScriptエコシステムの境界線を問い直す");
    expect(panel?.name).toEqual(["Evan You", "古川 陽介", "Alistair Smith", "Leo Kettmeir"]);
  });
});
