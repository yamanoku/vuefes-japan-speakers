import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AppEventBanner from "./AppEventBanner.vue";

describe("AppEventBanner", () => {
  it("開催日前は公式サイトへの全幅リンクを flex で中央配置する", () => {
    const wrapper = mount(AppEventBanner, {
      props: { eventDate: "2099-12-31" },
    });

    const aside = wrapper.get("aside");
    expect(aside.attributes("aria-label")).toBe("Vue Fes Japan 2026 のご案内");

    const link = aside.get('a[href="https://vuefes.jp/2026/"]');
    expect(link.text()).toBe(
      "Vue Fes Japan 2026は大手町プレイス ホール＆カンファレンスで10/24開催！",
    );

    wrapper.unmount();
  });

  it("開催日を過ぎたらバナーを非表示にする", () => {
    const wrapper = mount(AppEventBanner, {
      props: { eventDate: "2000-01-01" },
    });

    const aside = wrapper.get("aside");
    expect(aside.element.style.display).toBe("none");

    wrapper.unmount();
  });
});
