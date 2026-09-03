import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { museaSpeakerOptions } from "../../musea/sample-data";
import SpeakerFilterBar from "./SpeakerFilterBar.vue";

describe("SpeakerFilterBar", () => {
  it("検索欄を search ランドマークにしヒントを関連付ける", () => {
    const wrapper = mount(SpeakerFilterBar, {
      props: {
        query: "",
        selectedSpeaker: "all",
        speakerOptions: museaSpeakerOptions,
      },
    });

    const search = wrapper.get('form[role="search"]');
    expect(search.attributes("aria-label")).toBe("キーワードで絞り込み");

    const input = wrapper.get("#speaker-filter-search");
    const hintId = input.attributes("aria-describedby");
    expect(hintId).toBeTruthy();
    expect(wrapper.get(`[id="${hintId}"]`).text()).toContain("英語名");
  });
});
