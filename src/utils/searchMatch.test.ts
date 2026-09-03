import { describe, expect, it } from "vite-plus/test";
import { buildSearchHaystack, matchesSearchQuery, urlSearchToken } from "./searchMatch";

describe("searchMatch", () => {
  it("英語名・ふりがな・URLハンドルを検索対象にする", () => {
    const haystack = buildSearchHaystack(
      "やまのく",
      "yamanoku",
      urlSearchToken("https://vuefes.jp/2025/speaker/yamanoku"),
      "生成AI時代のWebアプリケーションアクセシビリティ改善",
    );

    expect(matchesSearchQuery(haystack, "yamanoku")).toBe(true);
    expect(matchesSearchQuery(haystack, "やまのく")).toBe(true);
    expect(matchesSearchQuery(haystack, "アクセシビリティ")).toBe(true);
  });

  it("開催年だけのパスは検索トークンにしない", () => {
    expect(urlSearchToken("https://vuefes.jp/2025/")).toBeUndefined();
  });
});
