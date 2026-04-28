import { vaporInteropPlugin } from "@vue/runtime-vapor";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, describe, expect, it } from "vite-plus/test";
import AppHeader from "./AppHeader.vue";

const STORAGE_KEY = "vfjs:color-scheme";

describe("AppHeader", () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.removeAttribute("data-color-scheme");
  });

  it("初回表示の配色セレクターでシステム設定を選択する", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    mount(AppHeader, {
      attachTo: host,
      global: {
        plugins: [vaporInteropPlugin],
      },
    });
    await nextTick();

    try {
      const select = host.querySelector("select");
      expect(select?.value).toBe("system");
      expect(host.innerHTML).not.toContain('<option value="light" selected>');
    } finally {
      host.remove();
    }
  });

  it("保存済みの配色設定をマウント後に反映する", async () => {
    localStorage.setItem(STORAGE_KEY, "light");

    const host = document.createElement("div");
    document.body.append(host);
    mount(AppHeader, {
      attachTo: host,
      global: {
        plugins: [vaporInteropPlugin],
      },
    });
    await nextTick();

    const select = host.querySelector("select") as HTMLSelectElement;
    expect(select.value).toBe("light");
    expect(document.documentElement.getAttribute("data-color-scheme")).toBe("light");

    select.value = "system";
    select.dispatchEvent(new Event("change"));
    host.remove();
  });
});
