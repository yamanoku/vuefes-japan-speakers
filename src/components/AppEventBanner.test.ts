import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AppEventBanner from "./AppEventBanner.vue";

describe("AppEventBanner", () => {
  it("開催日前は公式サイトへの全幅リンクを中央配置のテキストで置く", () => {
    const wrapper = mount(AppEventBanner, {
      props: { eventDate: "2099-12-31" },
    });

    const aside = wrapper.get("aside");
    expect(aside.attributes("aria-label")).toBe("Vue Fes Japan 2026 のご案内");
    expect(aside.classes()).toContain("border-b");
    expect(aside.classes()).toContain("bg-accent");

    const link = aside.get('a[href="https://vuefes.jp/2026/"]');
    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("aria-label")).toContain("外部サイトへ移動");
    expect(link.text()).toBe("Vue Fes Japan 2026は10/24開催！");
    expect(link.classes()).toContain("text-center");
    expect(link.classes()).toContain("block");
    expect(link.classes()).toContain("text-accent-ink");
    expect(link.classes()).toContain("hover:underline");

    wrapper.unmount();
  });

  it("開催日を過ぎたらバナーを描画しない", () => {
    const wrapper = mount(AppEventBanner, {
      props: { eventDate: "2000-01-01" },
    });

    expect(wrapper.find("aside").exists()).toBe(false);
    expect(wrapper.find('a[href="https://vuefes.jp/2026/"]').exists()).toBe(false);

    wrapper.unmount();
  });
});
