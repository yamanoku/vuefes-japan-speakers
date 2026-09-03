import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakers } from "../../musea/sample-data";
import ChronicleView from "./ChronicleView.vue";

describe("ChronicleView", () => {
  it("各年を見出しにして目次とライブリージョンを置く", () => {
    const wrapper = mount(ChronicleView, {
      props: {
        allSpeakers: museaSpeakers,
        query: "",
        selectedSpeaker: "all",
        selectedYear: "all",
      },
    });

    const headings = wrapper.findAll("h2");
    expect(headings.map((heading) => heading.text())).toEqual(
      expect.arrayContaining(["2018全 1 発表", "2025全 2 発表"]),
    );
    // main ランドマークは island 側が所有するためビュー内には持たない
    expect(wrapper.find("main").exists()).toBe(false);
    expect(wrapper.find('nav[aria-label="年度"]').exists()).toBe(true);
    expect(wrapper.find('a[href="#year-2018"]').exists()).toBe(true);

    const yearLink = wrapper.get('a[href="/2018"]');
    expect(yearLink.text()).toBe("2018 のスピーカー");
    expect(yearLink.attributes("aria-label")).toBeUndefined();

    const status = wrapper.find('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.text()).toContain("件の発表を表示");
  });

  it("該当なしのときライブリージョンが空状態を伝える", () => {
    const wrapper = mount(ChronicleView, {
      props: {
        allSpeakers: museaSpeakers,
        query: "not-found",
        selectedSpeaker: "all",
        selectedYear: "all",
      },
    });

    expect(wrapper.find('[role="status"]').text()).toBe("該当するスピーカーが見つかりません。");
    expect(wrapper.findAll("h2")).toHaveLength(0);
  });

  it("英語名・ふりがなでも発表を絞り込める", () => {
    const wrapper = mount(ChronicleView, {
      props: {
        allSpeakers: museaSpeakers,
        query: "Taro Yamada",
        selectedSpeaker: "all",
        selectedYear: "all",
      },
    });

    expect(wrapper.findAll("h2").map((heading) => heading.text())).toEqual(
      expect.arrayContaining(["2025全 2 発表"]),
    );
    expect(wrapper.text()).toContain("山田 太郎");
  });
});
