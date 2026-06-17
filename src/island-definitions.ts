import { defineIsland, type JsonObject } from "@vuerend/core";

export const HomePageIsland = defineIsland<JsonObject>("home-page", {
  load: () => import("./islands/HomePageIsland.vue"),
  hydrate: "load",
});

export const YearPageIsland = defineIsland<JsonObject>("year-page", {
  load: () => import("./islands/YearPageIsland.vue"),
  hydrate: "load",
});

export const SpeakerPageIsland = defineIsland<JsonObject>("speaker-page", {
  load: () => import("./islands/SpeakerPageIsland.vue"),
  hydrate: "load",
});
