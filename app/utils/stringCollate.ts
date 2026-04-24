/**
 * Node（SSR）とブラウザで並び順がずれないよう、ロケールを固定した比較。
 * TOP のスピーカー名ソート等でハイドレーション不一致を防ぐ。
 */
export function compareLexicalJa(a: string, b: string): number {
  return a.localeCompare(b, 'ja', { sensitivity: 'accent', numeric: true });
}
