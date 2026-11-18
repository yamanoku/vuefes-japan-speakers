import { describe, expect, it } from "vite-plus/test";
import { compareLexicalJa } from "./stringCollate";

describe("compareLexicalJa", () => {
  it("大文字と小文字を区別しない", () => {
    expect(compareLexicalJa("A", "a")).toBe(0);
  });

  it("数字の並びを数値として比較する", () => {
    expect(compareLexicalJa("item2", "item10")).toBeLessThan(0);
    expect(compareLexicalJa("item10", "item2")).toBeGreaterThan(0);
  });
});
