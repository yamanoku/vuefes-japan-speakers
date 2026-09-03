import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakers } from "../../musea/sample-data";
import HomePageIsland from "./HomePageIsland.vue";

describe("HomePageIsland", () => {
  it("スキップリンクと APG タブで表示を切り替える", async () => {
    const wrapper = mount(HomePageIsland, {
      attachTo: document.body,
      props: { allSpeakers: museaSpeakers },
    });

    expect(wrapper.get(".skip-link").attributes("href")).toBe("#main");
    expect(wrapper.get("#main").exists()).toBe(true);

    const tablist = wrapper.get('[role="tablist"]');
    expect(tablist.attributes("aria-label")).toBe("表示切替");

    const chronicleTab = wrapper.get("#tab-chronicle");
    const directoryTab = wrapper.get("#tab-directory");
    expect(chronicleTab.attributes("role")).toBe("tab");
    expect(chronicleTab.attributes("aria-controls")).toBe("panel-chronicle");
    expect(chronicleTab.attributes("aria-selected")).toBe("true");
    expect(chronicleTab.attributes("tabindex")).toBe("0");
    expect(directoryTab.attributes("tabindex")).toBe("-1");
    expect(wrapper.get("#panel-chronicle").attributes("role")).toBe("tabpanel");

    await chronicleTab.trigger("keydown", { key: "ArrowRight" });
    expect(directoryTab.attributes("aria-selected")).toBe("true");
    expect(directoryTab.attributes("tabindex")).toBe("0");
    expect(chronicleTab.attributes("tabindex")).toBe("-1");
    expect(wrapper.get("#panel-directory").attributes("role")).toBe("tabpanel");
    expect(wrapper.get("#panel-directory").attributes("aria-labelledby")).toBe("tab-directory");

    wrapper.unmount();
  });
});
