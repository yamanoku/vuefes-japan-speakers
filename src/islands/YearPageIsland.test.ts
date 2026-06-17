import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import YearPageIsland from "./YearPageIsland.vue";

describe("YearPageIsland", () => {
  it("年タイトルとスピーカーリストをレンダリングする", () => {
    const wrapper = mount(YearPageIsland, {
      props: {
        found: true,
        year: "2024",
        speakers: [
          {
            name: ["John Doe", "Jane Smith"],
            title: "Vue.js Advanced",
            url: "https://example.com/talk1",
          },
        ],
      },
    });

    expect(wrapper.html()).toContain("Vue Fes Japan");
    expect(wrapper.html()).toContain("2024");
    expect(wrapper.html()).toContain("John Doe");
    expect(wrapper.html()).toContain("Vue.js Advanced");
  });
});
