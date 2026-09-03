import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaYearCounts } from "../../musea/sample-data";
import YearFilterBar from "./YearFilterBar.vue";

describe("YearFilterBar", () => {
  it("選択中の年度ボタンに aria-pressed を付ける", async () => {
    const wrapper = mount(YearFilterBar, {
      props: {
        selectedYear: "all",
        counts: museaYearCounts,
      },
    });

    const buttons = wrapper.findAll('[role="group"] button');
    expect(buttons[0]?.attributes("aria-pressed")).toBe("true");
    expect(buttons[0]?.text()).toContain("選択中");
    expect(buttons.some((button) => button.attributes("aria-pressed") === "false")).toBe(true);

    await buttons.find((button) => button.text().startsWith("2025"))?.trigger("click");
    expect(wrapper.emitted("update:selectedYear")?.[0]).toEqual(["2025"]);
  });
});
