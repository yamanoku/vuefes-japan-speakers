import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { vaporInteropPlugin } from "@vue/runtime-vapor";
import YearPageIsland from "./YearPageIsland.vue";

describe("YearPageIsland", () => {
  it("年タイトルとスピーカーリストをレンダリングする", () => {
    const host = document.createElement("div");
    document.body.append(host);
    mount(YearPageIsland, {
      attachTo: host,
      global: {
        plugins: [vaporInteropPlugin],
      },
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

    try {
      expect(host.innerHTML).toContain("Vue Fes Japan");
      expect(host.innerHTML).toContain("2024");
      expect(host.innerHTML).toContain("John Doe");
      expect(host.innerHTML).toContain("Vue.js Advanced");
    } finally {
      host.remove();
    }
  });
});
