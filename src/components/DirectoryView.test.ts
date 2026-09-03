import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakers } from "../../musea/sample-data";
import DirectoryView from "./DirectoryView.vue";

const defaultProps = {
  allSpeakers: museaSpeakers,
  query: "",
  selectedSpeaker: "all",
  selectedYear: "all" as const,
};

describe("DirectoryView", () => {
  it("一覧見出しとソート状態・件数をプログラム的に伝える", () => {
    const wrapper = mount(DirectoryView, { props: defaultProps });

    const heading = wrapper.get("h2");
    expect(heading.text()).toContain("スピーカー一覧");
    expect(heading.text()).toContain("登壇回数の多い順");
    expect(wrapper.get("ol[aria-labelledby]").attributes("aria-labelledby")).toBe(
      heading.attributes("id"),
    );

    const sortButtons = wrapper.find('[role="group"][aria-label="並び替え"]').findAll("button");
    expect(sortButtons[0]?.attributes("aria-pressed")).toBe("true");
    expect(sortButtons[1]?.attributes("aria-pressed")).toBe("false");

    const status = wrapper.get('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.text()).toMatch(/\d+件中\d+件を表示/);
  });

  it("行ボタンの名前を短くし年度グリッドを隠す", async () => {
    const wrapper = mount(DirectoryView, { props: defaultProps });

    const evan = wrapper
      .findAll("button[aria-expanded]")
      .find((button) => (button.attributes("aria-label") || "").includes("Evan You"));

    expect(evan).toBeTruthy();
    expect(evan?.attributes("aria-label")).toBe("Evan You、2回登壇、詳細を開く");
    expect(evan?.attributes("aria-controls")).toBe(
      `directory-panel-${encodeURIComponent("Evan You")}`,
    );
    expect(evan?.find('[aria-hidden="true"].inline-grid').exists()).toBe(true);
    expect(evan?.text()).toContain("×2");

    await evan?.trigger("click");
    const opened = wrapper
      .findAll("button[aria-expanded]")
      .find((button) => (button.attributes("aria-label") || "").includes("Evan You"));
    expect(opened?.attributes("aria-expanded")).toBe("true");
    expect(opened?.attributes("aria-label")).toBe("Evan You、2回登壇、詳細を閉じる");
    expect(wrapper.find(`[id="directory-panel-${encodeURIComponent("Evan You")}"]`).exists()).toBe(
      true,
    );
  });

  it("空状態をライブリージョンで通知する", () => {
    const wrapper = mount(DirectoryView, {
      props: { ...defaultProps, query: "not-found" },
    });

    expect(wrapper.get('[role="status"]').text()).toContain("該当するスピーカーが見つかりません。");
  });

  it("英語名・ふりがな・URLハンドルでもスピーカーを絞り込める", () => {
    const wrapper = mount(DirectoryView, {
      props: { ...defaultProps, query: "Taro Yamada" },
    });
    expect(wrapper.text()).toContain("山田 太郎");

    const ruby = mount(DirectoryView, {
      props: { ...defaultProps, query: "やまだ" },
    });
    expect(ruby.text()).toContain("山田 太郎");

    const handle = mount(DirectoryView, {
      props: {
        ...defaultProps,
        allSpeakers: [
          {
            year: "2025",
            name: ["やまのく"],
            nameEn: ["yamanoku"],
            title: "アクセシビリティ",
            url: "https://vuefes.jp/2025/speaker/yamanoku",
          },
        ],
        query: "yamanoku",
      },
    });
    expect(handle.text()).toContain("やまのく");
  });
});
