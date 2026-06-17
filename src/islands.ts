import { defineIslands } from "@vuerend/core";
import { HomePageIsland, SpeakerPageIsland, YearPageIsland } from "./island-definitions";
import "./assets/css/main.css";

export { HomePageIsland, SpeakerPageIsland, YearPageIsland } from "./island-definitions";

export default defineIslands([HomePageIsland, YearPageIsland, SpeakerPageIsland]);
