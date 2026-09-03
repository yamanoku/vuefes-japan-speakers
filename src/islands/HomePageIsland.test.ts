import { afterEach, describe, expect, it } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { museaSpeakers } from "../../musea/sample-data";
import HomePageIsland from "./HomePageIsland.vue";

describe("HomePageIsland", () => {
  afterEach(() => {
    localStorage.removeItem("vfjs:view");
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  });

  it("表示切替タブを APG Tabs として関連付ける", () => {
    const wrapper = mount(HomePageIsland, {
      props: { allSpeakers: museaSpeakers },
      attachTo: document.body,
    });

    const tablist = wrapper.get('[role="tablist"]');
    expect(tablist.attributes("aria-label")).toBe("表示切替");

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]?.attributes("aria-selected")).toBe("true");
    expect(tabs[0]?.attributes("tabindex")).toBe("0");
    expect(tabs[1]?.attributes("aria-selected")).toBe("false");
    expect(tabs[1]?.attributes("tabindex")).toBe("-1");

    const panel = wrapper.get('[role="tabpanel"]');
    expect(tabs[0]?.attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(panel.attributes("aria-labelledby")).toBe(tabs[0]?.attributes("id"));

    // タブパネルはスキップリンク先の main ランドマーク内に置く
    const main = wrapper.get("main#main");
    expect(main.find('[role="tabpanel"]').exists()).toBe(true);
    expect(main.find("h1").text()).toContain("Vue Fes Japan Speakers");
    expect(main.find("aside").attributes("aria-label")).toBe("開催概要");

    wrapper.unmount();
  });

  it("矢印キーでタブを切り替え非選択タブを tabindex=-1 にする", async () => {
    const wrapper = mount(HomePageIsland, {
      props: { allSpeakers: museaSpeakers },
      attachTo: document.body,
    });
    await flushPromises();
    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[0]?.trigger("keydown", { key: "ArrowRight" });
    await nextTick();

    const updatedTabs = wrapper.findAll('[role="tab"]');
    expect(updatedTabs[0]?.attributes("aria-selected")).toBe("false");
    expect(updatedTabs[0]?.attributes("tabindex")).toBe("-1");
    expect(updatedTabs[1]?.attributes("aria-selected")).toBe("true");
    expect(updatedTabs[1]?.attributes("tabindex")).toBe("0");
    expect(wrapper.get('[role="tabpanel"]').attributes("aria-labelledby")).toBe(
      updatedTabs[1]?.attributes("id"),
    );

    wrapper.unmount();
  });

  it("Directory 選択を URL に残し、view=directory から復元する", async () => {
    const wrapper = mount(HomePageIsland, {
      props: { allSpeakers: museaSpeakers },
      attachTo: document.body,
    });
    await flushPromises();
    await nextTick();

    const tabs = wrapper.findAll('[role="tab"]');
    await tabs[1]?.trigger("click");
    await nextTick();

    expect(new URL(window.location.href).searchParams.get("view")).toBe("directory");
    expect(localStorage.getItem("vfjs:view")).toBe("index");
    wrapper.unmount();

    const restored = mount(HomePageIsland, {
      props: { allSpeakers: museaSpeakers },
      attachTo: document.body,
    });
    await flushPromises();
    await nextTick();

    const restoredTabs = restored.findAll('[role="tab"]');
    expect(restoredTabs[1]?.attributes("aria-selected")).toBe("true");
    restored.unmount();
  });
});
