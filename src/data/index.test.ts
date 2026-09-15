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
    const byName = (name: string) =>
      speakers.find((speaker) => speaker.name.length === 1 && speaker.name[0] === name);
    const panel = speakers.find((speaker) => speaker.format === "panel");

    expect(byName("Eduardo San Martin Morote")?.title).toBe("Type-Safe URLs");
    expect(byName("Charles Wang")?.title).toBe("Vite Task’s Cache Magic");
    expect(byName("中野 美咲")?.title).toBe("ブランドのためのWebGLアニメーション（仮）");
    expect(panel?.title).toBe("JavaScriptエコシステムの境界線を問い直す");
    expect(panel?.name).toEqual([
      "Evan You",
      "古川 陽介",
      "Alistair Smith",
      "Leo Kettmeir",
      "re-taro",
    ]);
  });

  it("2026のパネルのみ登壇者は個別エントリを持たない", () => {
    const speakers = getSpeakersByYear("2026");
    const panelOnly = ["古川 陽介", "Alistair Smith", "Leo Kettmeir", "re-taro"];

    for (const name of panelOnly) {
      const individual = speakers.find(
        (speaker) => speaker.name.length === 1 && speaker.name[0] === name,
      );
      const inPanel = speakers.some(
        (speaker) => speaker.format === "panel" && speaker.name.includes(name),
      );

      expect(individual).toBeUndefined();
      expect(inPanel).toBe(true);
    }
  });

  it("2026のスポンサーセッションを公式タイムテーブルに合わせて持つ", () => {
    const speakers = getSpeakersByYear("2026");
    const byName = (name: string) =>
      speakers.find((speaker) => speaker.name.length === 1 && speaker.name[0] === name);

    expect(byName("竹井啓")?.title).toBe(
      "デザインを開発する ~ Vueで実現するデザインプロセス改善 ~",
    );
    expect(byName("山口 祐司")?.title).toBe("契約で守るコンパウンドプロダクトのデザインシステム");
    expect(byName("篠田貴大")?.title).toBe(
      "クラウドサインを止めずに Nuxt へ、次の10年のために先に決めたこと",
    );
    expect(byName("Matt Kane")?.title).toBe("Astro is the new WordPress");
    expect(byName("矢光 隆太郎")?.title).toBe(
      "コンポーネントのライフサイクルとグローバル状態の扱い方",
    );
    expect(byName("宮崎喬行")?.title).toBe("新卒のキャッチアップコストから決めたNuxt 3移行");
    expect(byName("永渕 景祐")?.title).toBe("Slidevで踏み出すVueとLTの第一歩");
    expect(byName("揚野将士")?.title).toBe(
      "npmサプライチェーンが狙われた1年 ─ 金融システムで実践している防御策",
    );
  });
});
