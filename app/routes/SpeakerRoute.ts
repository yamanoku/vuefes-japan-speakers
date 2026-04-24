import { defineComponent, h, type PropType } from "vue";
import type { SpeakerWithYear } from "~~/types";
import { SpeakerPageIsland } from "../island-definitions";

export default defineComponent({
  name: "SpeakerRoute",
  props: {
    found: {
      type: Boolean,
      required: true,
    },
    speakerName: {
      type: String,
      required: true,
    },
    speakers: {
      type: Array as PropType<SpeakerWithYear[]>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(SpeakerPageIsland, {
        found: props.found,
        speakerName: props.speakerName,
        speakers: props.speakers,
      });
  },
});
