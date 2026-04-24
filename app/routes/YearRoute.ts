import { defineComponent, h, type PropType } from "vue";
import type { SpeakerInfo } from "~~/types";
import { YearPageIsland } from "../island-definitions";

export default defineComponent({
  name: "YearRoute",
  props: {
    found: {
      type: Boolean,
      required: true,
    },
    speakers: {
      type: Array as PropType<SpeakerInfo[]>,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(YearPageIsland, {
        found: props.found,
        speakers: props.speakers,
        year: props.year,
      });
  },
});
