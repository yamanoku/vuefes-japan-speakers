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

    expect(html).not.toContain("<aside");
    expect(html).not.toContain('href="https://vuefes.jp/2026/"');
  });

  it("保存済みの配色設定をマウント後に反映する", async () => {
    localStorage.setItem(STORAGE_KEY, "light");

    const wrapper = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    await nextTick();

    expect(wrapper.get("select").element.value).toBe("light");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");

    wrapper.unmount();
  });

  it("配色の変更を属性と localStorage に残し、システム設定では属性を外す", async () => {
    localStorage.setItem(STORAGE_KEY, "light");
    const established = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    established.unmount();

    document.documentElement.setAttribute("data-color-scheme", "dark");
    const unchanged = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");
    unchanged.unmount();

    localStorage.setItem(STORAGE_KEY, "dark");
    const restored = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    expect(restored.get("select").element.value).toBe("dark");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("dark");

    await restored.get("select").setValue("system");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("system");
    expect(document.documentElement.hasAttribute("data-color-scheme")).toBe(false);

    await restored.get("select").setValue("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");
    restored.unmount();
  });

  it("保存値が light / dark / system 以外ならシステム設定のままにする", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const prior = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("dark");
    prior.unmount();

    localStorage.setItem(STORAGE_KEY, "system");
    document.documentElement.setAttribute("data-color-scheme", "light");
    const established = mount(AppHeader, { attachTo: document.body });
    await flushPromises();
    expect(established.get("select").element.value).toBe("system");
    expect(document.documentElement.hasAttribute("data-color-scheme")).toBe(false);
    established.unmount();

    localStorage.setItem(STORAGE_KEY, "nope");
    document.documentElement.setAttribute("data-color-scheme", "dark");
    const wrapper = mount(AppHeader, { attachTo: document.body });
    await flushPromises();

    expect(wrapper.get("select").element.value).toBe("system");
    expect(document.documentElement.hasAttribute("data-color-scheme")).toBe(false);
    wrapper.unmount();
  });
});
