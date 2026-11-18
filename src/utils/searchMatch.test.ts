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

    expect(haystack).toBe(
      "やまのく yamanoku yamanoku 生成ai時代のwebアプリケーションアクセシビリティ改善",
    );
    expect(matchesSearchQuery(haystack, "  Yamanoku ")).toBe(true);
    expect(matchesSearchQuery(haystack, "やまのく")).toBe(true);
    expect(matchesSearchQuery(haystack, "アクセシビリティ")).toBe(true);
  });

  it("空の値と空白だけの語は検索対象に残さない", () => {
    expect(buildSearchHaystack(undefined, "", ["", "Vue"], "   ")).toBe("vue");
    expect(matchesSearchQuery("vue", "")).toBe(true);
    expect(matchesSearchQuery("vue", "   ")).toBe(true);
  });

  it("パス末尾のハンドルを取り、開催年だけの末尾は捨てる", () => {
    expect(urlSearchToken("https://vuefes.jp/2025/speaker/yamanoku")).toBe("yamanoku");
    expect(urlSearchToken("https://vuefes.jp/2025/speaker/yamanoku/")).toBe("yamanoku");
    expect(urlSearchToken("https://vuefes.jp/2025/")).toBeUndefined();
    expect(urlSearchToken("https://vuefes.jp/2025/speaker/2025x")).toBe("2025x");
    expect(urlSearchToken("https://vuefes.jp/2025/speaker/x2025")).toBe("x2025");
    expect(urlSearchToken("not a url")).toBeUndefined();
  });
});
