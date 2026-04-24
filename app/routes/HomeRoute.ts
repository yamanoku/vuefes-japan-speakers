import { defineComponent, h, type PropType } from "vue";
import type { SpeakerWithYear } from "~~/types";
import { HomePageIsland } from "../island-definitions";

export default defineComponent({
  name: "HomeRoute",
  props: {
    allSpeakers: {
      type: Array as PropType<SpeakerWithYear[]>,
      required: true,
    },
  },
  setup(props) {
    return () => h(HomePageIsland, { allSpeakers: props.allSpeakers });
  },
});
