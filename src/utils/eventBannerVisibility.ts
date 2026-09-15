/** Vue Fes Japan は日本開催のため、日付判定は Asia/Tokyo 基準にする */
export const EVENT_BANNER_TIME_ZONE = "Asia/Tokyo";

const EVENT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `now` を指定タイムゾーンの暦日（YYYY-MM-DD）に変換する。
 * `en-CA` は Intl で YYYY-MM-DD を返す。
 */
export function formatCalendarDate(now: Date, timeZone: string = EVENT_BANNER_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * 開催日（YYYY-MM-DD）当日までは表示し、その翌日以降は非表示にする。
 * 形式が不正な場合は非表示にする。
 */
export function isEventBannerVisible(
  eventDate: string,
  now: Date = new Date(),
  timeZone: string = EVENT_BANNER_TIME_ZONE,
): boolean {
  if (!EVENT_DATE_PATTERN.test(eventDate)) return false;
  const today = formatCalendarDate(now, timeZone);
  return today <= eventDate;
}
