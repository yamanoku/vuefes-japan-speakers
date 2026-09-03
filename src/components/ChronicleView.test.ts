import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakers } from "../../musea/sample-data";
import ChronicleView from "./ChronicleView.vue";

describe("ChronicleView", () => {
  it("各年を見出しにしてライブリージョンで件数を伝える", () => {
    const wrapper = mount(ChronicleView, {
      props: {
        allSpeakers: museaSpeakers,
        selectedYear: "all",
        selectedSpeaker: "all",
        query: "",
      },
    });

    const yearHeadings = wrapper.findAll("h2").map((heading) => heading.text());
    expect(yearHeadings).toContain("2018");
    expect(yearHeadings).toContain("2025");
    expect(wrapper.find("h2[aria-hidden]").exists()).toBe(false);

    const status = wrapper.get('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.attributes("aria-atomic")).toBe("true");
    expect(status.text()).toContain("5件中5件を表示");
  });

  it("該当なしのとき同じライブリージョンで空状態を伝える", async () => {
    const wrapper = mount(ChronicleView, {
      props: {
        allSpeakers: museaSpeakers,
        selectedYear: "all",
        selectedSpeaker: "all",
        query: "not-found",
      },
    });

    const status = wrapper.get('[role="status"]');
    expect(status.text()).toContain("5件中0件を表示");
    expect(status.text()).toContain("該当するスピーカーが見つかりません。");
    expect(wrapper.find("#year-list").exists()).toBe(true);
  });
});
