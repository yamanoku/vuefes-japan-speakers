import { describe, expect, it } from "vite-plus/test";
import type { SpeakerWithYear } from "../../types";
import { buildSpeakerMap, hasJapanese } from "./speakerMap";

describe("buildSpeakerMap", () => {
  it("パネルディスカッションの区分を発表履歴に引き継ぐ", () => {
    const allSpeakers: SpeakerWithYear[] = [
      {
        year: "2025",
        name: ["Alice", "Bob"],
        title: "Panel Discussion",
        url: "https://example.com/panel",
        format: "panel",
      },
    ];

    const speakerMap = buildSpeakerMap(allSpeakers);

    expect(speakerMap.get("Alice")?.talks[0]).toMatchObject({
      title: "Panel Discussion",
      format: "panel",
      coSpeakers: ["Bob"],
    });
  });

  it("先に得た読みと英語名を保ち、年と発表は昇順にまとめる", () => {
    const speakerMap = buildSpeakerMap([
      {
        year: "2024",
        name: ["Alice", "Bob"],
        nameRuby: ["ありす"],
        nameEn: ["alice"],
        title: "Later",
        url: "https://example.com/2024",
      },
      {
        year: "2019",
        name: ["Alice"],
        nameRuby: ["アリス"],
        nameEn: ["alice-later"],
        title: "Earlier",
        url: "https://example.com/2019",
      },
      {
        year: "2024",
        name: ["Bob"],
        nameEn: ["bob"],
        title: "Bob solo",
        url: "https://example.com/bob",
      },
      {
        year: "2025",
        name: ["Carol"],
        title: "No reading",
        url: "https://example.com/carol-1",
      },
      {
        year: "2022",
        name: ["Carol"],
        nameRuby: ["きゃろる"],
        title: "With reading",
        url: "https://example.com/carol-2",
      },
    ]);

    expect(speakerMap.get("Alice")).toMatchObject({
      nameRuby: "ありす",
      nameEn: "alice",
      years: ["2019", "2024"],
    });
    expect(speakerMap.get("Alice")?.talks.map((talk) => talk.year)).toEqual(["2019", "2024"]);
    expect(speakerMap.get("Bob")).toMatchObject({
      nameEn: "bob",
      years: ["2024"],
    });
    expect(speakerMap.get("Bob")?.talks.map((talk) => talk.title)).toEqual(["Later", "Bob solo"]);
    expect(speakerMap.get("Carol")).toMatchObject({
      nameRuby: "きゃろる",
      years: ["2022", "2025"],
    });
  });
});

describe("hasJapanese", () => {
  it("ひらがな・カタカナ・漢字を日本語とみなす", () => {
    expect(hasJapanese("やまだ")).toBe(true);
    expect(hasJapanese("ヤマダ")).toBe(true);
    expect(hasJapanese("山田")).toBe(true);
    expect(hasJapanese("Evan You")).toBe(false);
    expect(hasJapanese("")).toBe(false);
  });
});
