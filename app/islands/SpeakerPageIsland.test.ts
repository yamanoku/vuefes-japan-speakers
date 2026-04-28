import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { vaporInteropPlugin } from "@vue/runtime-vapor";
import SpeakerPageIsland from "./SpeakerPageIsland.vue";

describe("SpeakerPageIsland", () => {
  it("スピーカー名と発表一覧をレンダリングする", () => {
    const host = document.createElement("div");
    document.body.append(host);
    mount(SpeakerPageIsland, {
      attachTo: host,
      global: {
        plugins: [vaporInteropPlugin],
      },
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

    try {
      expect(host.innerHTML).toContain("John Doe");
      expect(host.innerHTML).toContain("Vue 3 Deep Dive");
      expect(host.innerHTML).toContain("Vue.js Advanced");
      expect(host.innerHTML).toContain("2023");
      expect(host.innerHTML).toContain("2024");
    } finally {
      host.remove();
    }
  });
});
