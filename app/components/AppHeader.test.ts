import { renderToString } from "@vue/server-renderer";
import { mount } from "@vue/test-utils";
import { createSSRApp, nextTick } from "vue";
import { afterEach, describe, expect, it } from "vite-plus/test";
import AppHeader from "./AppHeader.vue";

const STORAGE_KEY = "vfjs:color-scheme";

describe("AppHeader", () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.removeAttribute("data-color-scheme");
  });

  it("初回表示の配色セレクターでシステム設定を選択する", async () => {
    const html = await renderToString(createSSRApp(AppHeader));

    expect(html).toContain('<option value="system" selected>');
    expect(html).not.toContain('<option value="light" selected>');
  });

  it("保存済みの配色設定をマウント後に反映する", async () => {
    localStorage.setItem(STORAGE_KEY, "light");

    const wrapper = mount(AppHeader);
    await nextTick();

    const select = wrapper.find("select").element as HTMLSelectElement;
    expect(select.value).toBe("light");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");

    await wrapper.find("select").setValue("system");
    wrapper.unmount();
  });
});
