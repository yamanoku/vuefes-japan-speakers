function asList(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

/** 公式ページ URL の末尾（スピーカーハンドル等）を検索対象に含める。 */
export function urlSearchToken(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split("/").filter(Boolean).at(-1);
    if (!last || /^\d{4}$/.test(last)) return undefined;
    return last;
  } catch {
    return undefined;
  }
}

export function buildSearchHaystack(...values: Array<string | string[] | undefined>): string {
  return values
    .flatMap((value) => asList(value))
    .filter((value) => value.trim().length > 0)
    .join(" ")
    .toLowerCase();
}

export function matchesSearchQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystack.includes(q);
}
