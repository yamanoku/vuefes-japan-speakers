import { renderToString } from "@vue/server-renderer";
import { flushPromises, mount } from "@vue/test-utils";
import { createSSRApp, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import AppHeader from "./AppHeader.vue";

const STORAGE_KEY = "vfjs:color-scheme";

describe("AppHeader", () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.removeAttribute("data-color-scheme");
    vi.useRealTimers();
  });

  it("初回表示の配色セレクターでシステム設定を選択する", async () => {
    const html = await renderToString(createSSRApp(AppHeader));

    expect(html).toMatch(/<option(?=[^>]*\bvalue="system")(?=[^>]*\bselected)[^>]*>/);
    expect(html).not.toMatch(/<option(?=[^>]*\bvalue="light")(?=[^>]*\bselected)[^>]*>/);
  });

  it("本文とフッターへのスキップリンクを先頭に置く", async () => {
    const html = await renderToString(createSSRApp(AppHeader));

    expect(html).toContain('href="#main"');
    expect(html).toContain('href="#site-footer"');
    expect(html).toContain("本文へ");
    expect(html).toContain("フッターへ");
  });

  it("ヘッダー直下に Vue Fes Japan 2026 誘導バナーを置く", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-01T12:00:00+09:00"));

    const html = await renderToString(createSSRApp(AppHeader));

    expect(html).toContain('href="https://vuefes.jp/2026/"');
    expect(html).toContain(
      "Vue Fes Japan 2026は大手町プレイス ホール＆カンファレンスで10/24開催！",
    );
  });

  it("開催日翌日以降は誘導バナーを非表示にする", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-25T00:00:00+09:00"));

    const html = await renderToString(createSSRApp(AppHeader));

    expect(html).toMatch(/<aside[^>]*style="display:none;"/);
    expect(html).toContain('href="https://vuefes.jp/2026/"');
  });

  it("保存済みの配色設定をマウント後に反映する", async () => {
    localStorage.setItem(STORAGE_KEY, "light");

    const wrapper = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    await nextTick();

    // scheme が localStorage から復元され、DOM に反映されていることを確認
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");

    wrapper.unmount();
  });
});
