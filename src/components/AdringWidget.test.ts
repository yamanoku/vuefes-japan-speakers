import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AdringWidget from "./AdringWidget.vue";

describe("AdringWidget", () => {
  it("広告ランドマークをフッター前の枠として置き、テストでは外部スクリプトを読み込まない", () => {
    const wrapper = mount(AdringWidget);

    const aside = wrapper.get("aside");
    expect(aside.attributes("aria-label")).toBe("広告");
    expect(aside.text()).toContain("広告");
    expect(aside.get("div").attributes("class")).toContain("max-w-[680px]");
    expect(aside.get("div").attributes("class")).toContain("min-h-[180px]");
    expect(wrapper.find("script").exists()).toBe(false);

    wrapper.unmount();
  });
});
