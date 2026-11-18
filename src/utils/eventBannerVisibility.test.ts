import { describe, expect, it } from "vite-plus/test";
import { formatCalendarDate, isEventBannerVisible } from "./eventBannerVisibility";

describe("formatCalendarDate", () => {
  it("指定したタイムゾーンの暦日を YYYY-MM-DD で返す", () => {
    // UTC では 10/23 だが、JST では 10/24 00:00
    const justAfterJstMidnight = new Date("2026-10-23T15:00:00.000Z");
    expect(formatCalendarDate(justAfterJstMidnight)).toBe("2026-10-24");
    expect(formatCalendarDate(justAfterJstMidnight, "UTC")).toBe("2026-10-23");
    expect(formatCalendarDate(justAfterJstMidnight, "Asia/Tokyo")).toBe("2026-10-24");
  });
});

describe("isEventBannerVisible", () => {
  it("開催日より前は表示する", () => {
    expect(isEventBannerVisible("2026-10-24", new Date("2026-10-01T00:00:00+09:00"))).toBe(true);
  });

  it("開催日当日は表示する", () => {
    expect(isEventBannerVisible("2026-10-24", new Date("2026-10-24T23:59:59+09:00"))).toBe(true);
  });

  it("開催日の翌日以降は非表示にする", () => {
    expect(isEventBannerVisible("2026-10-24", new Date("2026-10-25T00:00:00+09:00"))).toBe(false);
  });

  it("UTC では翌日でも JST 当日なら表示する", () => {
    // 2026-10-24 23:30 JST = 2026-10-24 14:30 UTC
    expect(isEventBannerVisible("2026-10-24", new Date("2026-10-24T14:30:00.000Z"))).toBe(true);
  });

  it("YYYY-MM-DD 以外の形式は非表示にする", () => {
    const now = new Date("2026-10-01T00:00:00+09:00");
    expect(isEventBannerVisible("2026/10/24", now)).toBe(false);
    expect(isEventBannerVisible("", now)).toBe(false);
    expect(isEventBannerVisible("x2026-10-24", now)).toBe(false);
    expect(isEventBannerVisible("2026-10-24extra", now)).toBe(false);
  });
});
