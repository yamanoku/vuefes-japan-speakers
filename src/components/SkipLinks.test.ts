import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import SkipLinks from "./SkipLinks.vue";

describe("SkipLinks", () => {
  it("本文へのスキップリンクを先頭に置く", () => {
    const wrapper = mount(SkipLinks, {
      slots: {
        default: '<a class="skip-link" href="#directory-list">スピーカー一覧へ</a>',
      },
    });

    const links = wrapper.findAll("a.skip-link");
    expect(wrapper.get("nav").attributes("aria-label")).toBe("スキップリンク");
    expect(links[0]?.attributes("href")).toBe("#main");
    expect(links[0]?.text()).toBe("本文へ");
    expect(links[1]?.attributes("href")).toBe("#directory-list");
  });
});
