import { describe, expect, it } from "vite-plus/test";
import type { SpeakerWithYear } from "../../types";
import { buildSpeakerMap } from "./speakerMap";

describe("buildSpeakerMap", () => {
  it("パネルディスカッションの区分を発表履歴に引き継ぐ", () => {
    const allSpeakers: SpeakerWithYear[] = [
      {
        year: "2025",
        name: ["Alice", "Bob"],
        title: "Panel Discussion",
        url: "https://example.com/panel",
        format: "panel",
      },
    ];

    const speakerMap = buildSpeakerMap(allSpeakers);

    expect(speakerMap.get("Alice")?.talks[0]).toMatchObject({
      title: "Panel Discussion",
      format: "panel",
      coSpeakers: ["Bob"],
    });
  });
});
