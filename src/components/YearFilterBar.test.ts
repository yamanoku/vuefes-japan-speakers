import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import YearFilterBar from "./YearFilterBar.vue";

const counts = {
  all: 10,
  2018: 2,
  2019: 0,
  2022: 1,
  2023: 1,
  2024: 2,
  2025: 2,
  2026: 2,
};

describe("YearFilterBar", () => {
  it("選択中の年度ボタンに aria-pressed を付ける", () => {
    const wrapper = mount(YearFilterBar, {
      props: { selectedYear: "2025", counts },
    });

    const buttons = wrapper.findAll("button");
    const allButton = buttons.find((button) => button.text().includes("ALL"));
    const yearButton = buttons.find((button) => button.text().includes("2025"));

    expect(allButton?.attributes("aria-pressed")).toBe("false");
    expect(yearButton?.attributes("aria-pressed")).toBe("true");
    expect(yearButton?.text()).toContain("選択中");
  });

  it("年度フィルタは group のみで region と二重ネストしない", () => {
    const wrapper = mount(YearFilterBar, {
      props: { selectedYear: "all", counts },
    });

    expect(wrapper.find('[role="region"]').exists()).toBe(false);
    expect(wrapper.find('[role="group"]').attributes("aria-labelledby")).toBe(
      wrapper.get("span").attributes("id"),
    );
  });
});
