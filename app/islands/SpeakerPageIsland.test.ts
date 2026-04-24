import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import SpeakerPageIsland from "./SpeakerPageIsland.vue";

describe("SpeakerPageIsland", () => {
  it("スピーカー名と発表一覧をレンダリングする", () => {
    const wrapper = mount(SpeakerPageIsland, {
      props: {
        found: true,
        speakerName: "John Doe",
        speakers: [
          {
            year: "2023",
            name: ["John Doe"],
            title: "Vue 3 Deep Dive",
            url: "https://example.com/talk1",
          },
          {
            year: "2024",
            name: ["John Doe", "Jane Smith"],
            title: "Vue.js Advanced",
            url: "https://example.com/talk2",
          },
        ],
      },
    });

    expect(wrapper.html()).toContain("John Doe");
    expect(wrapper.html()).toContain("Vue 3 Deep Dive");
    expect(wrapper.html()).toContain("Vue.js Advanced");
    expect(wrapper.html()).toContain("2023");
    expect(wrapper.html()).toContain("2024");
  });
});
