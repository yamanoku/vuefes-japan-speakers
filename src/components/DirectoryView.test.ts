import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakers } from "../../musea/sample-data";
import DirectoryView from "./DirectoryView.vue";

describe("DirectoryView", () => {
  it("一覧見出しとソート状態をプログラム的に伝える", () => {
    const wrapper = mount(DirectoryView, {
      props: {
        allSpeakers: museaSpeakers,
        selectedYear: "all",
        selectedSpeaker: "all",
        query: "",
      },
    });

    const heading = wrapper.get("h2");
    expect(heading.text()).toContain("スピーカー一覧");
    expect(heading.text()).toContain("登壇回数の多い順");
    expect(wrapper.get("#directory-list ol").attributes("aria-labelledby")).toBe(
      heading.attributes("id"),
    );

    const sortButtons = wrapper.findAll('[aria-label="並び替え"] button');
    expect(sortButtons[0]?.attributes("aria-pressed")).toBe("true");
    expect(sortButtons[1]?.attributes("aria-pressed")).toBe("false");
    expect(sortButtons[0]?.text()).toContain("登壇回数の多い順");
  });

  it("行ボタンの名前に年度グリッドを含めず aria-controls を付ける", async () => {
    const wrapper = mount(DirectoryView, {
      attachTo: document.body,
      props: {
        allSpeakers: museaSpeakers,
        selectedYear: "all",
        selectedSpeaker: "all",
        query: "",
      },
    });

    const row = wrapper
      .findAll("button[aria-expanded]")
      .find((button) => (button.attributes("aria-label") ?? "").includes("Evan You"));
    expect(row).toBeTruthy();
    expect(row!.attributes("aria-label")).toBe("Evan You、2回登壇、詳細を開く");
    expect(row!.attributes("aria-label")).not.toMatch(/\b18\b/);
    expect(row!.attributes("aria-controls")).toBe(
      `speaker-panel-${encodeURIComponent("Evan You")}`,
    );

    await row!.trigger("click");
    expect(row!.attributes("aria-expanded")).toBe("true");
    expect(row!.attributes("aria-label")).toBe("Evan You、2回登壇、詳細を閉じる");
    expect(wrapper.find(`#${CSS.escape(row!.attributes("aria-controls")!)}`).exists()).toBe(true);

    wrapper.unmount();
  });

  it("件数をライブリージョンの完全文で伝える", () => {
    const wrapper = mount(DirectoryView, {
      props: {
        allSpeakers: museaSpeakers,
        selectedYear: "all",
        selectedSpeaker: "all",
        query: "not-found",
      },
    });

    const status = wrapper.get('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.text()).toContain("4件中0件を表示");
    expect(status.text()).toContain("該当するスピーカーが見つかりません。");
  });
});
