import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AppFooter from "./AppFooter.vue";

describe("AppFooter", () => {
  it("GitHub の外部サイト案内をリンク内に置く", () => {
    const wrapper = mount(AppFooter);
    const link = wrapper.get('a[href="https://github.com/yamanoku/vuefes-japan-speakers"]');

    expect(link.attributes("rel")).toBe("noopener noreferrer");
    expect(link.text()).toContain("GitHub");
    expect(link.text()).toContain("外部サイトへ移動");
    expect(wrapper.find("a + span").exists()).toBe(false);
  });
});
