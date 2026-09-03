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

    const tabs = wrapper.findAll('[role="tab"]');
    const chronicleTab = tabs[0]!;
    const directoryTab = tabs[1]!;
    expect(chronicleTab.attributes("aria-selected")).toBe("true");
    expect(chronicleTab.attributes("tabindex")).toBe("0");
    expect(directoryTab.attributes("tabindex")).toBe("-1");
    expect(chronicleTab.attributes("aria-controls")).toBeTruthy();

    const chroniclePanel = wrapper.get('[role="tabpanel"]');
    expect(chroniclePanel.attributes("id")).toBe(chronicleTab.attributes("aria-controls"));
    expect(chroniclePanel.attributes("aria-labelledby")).toBe(chronicleTab.attributes("id"));

    await chronicleTab.trigger("keydown", { key: "ArrowRight" });
    expect(directoryTab.attributes("aria-selected")).toBe("true");
    expect(directoryTab.attributes("tabindex")).toBe("0");
    expect(chronicleTab.attributes("tabindex")).toBe("-1");

    const directoryPanel = wrapper.get('[role="tabpanel"]');
    expect(directoryPanel.attributes("id")).toBe(directoryTab.attributes("aria-controls"));
    expect(directoryPanel.attributes("aria-labelledby")).toBe(directoryTab.attributes("id"));

    wrapper.unmount();
  });
});
