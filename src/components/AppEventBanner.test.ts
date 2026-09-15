import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AppEventBanner from "./AppEventBanner.vue";

describe("AppEventBanner", () => {
  it("公式サイトへの全幅リンクを中央配置のテキストで置く", () => {
    const wrapper = mount(AppEventBanner);

    const aside = wrapper.get("aside");
    expect(aside.attributes("aria-label")).toBe("Vue Fes Japan 2026 のご案内");
    expect(aside.classes()).toContain("border-b");
    expect(aside.classes()).toContain("bg-paper-2");

    const link = aside.get('a[href="https://vuefes.jp/2026/"]');
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("aria-label")).toContain("外部サイトへ移動");
    expect(link.text()).toBe("Vue Fes Japan 2026は10/24開催！");
    expect(link.classes()).toContain("text-center");
    expect(link.classes()).toContain("block");

    wrapper.unmount();
  });
});
