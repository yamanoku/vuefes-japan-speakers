import { defineIsland, type JsonObject } from "@vuerend/core";

// Vapor SSR hydration is not stable yet; mount over SSR HTML after the page becomes idle.
export const HomePageIsland = defineIsland<JsonObject>("home-page", {
  load: () => import("./islands/HomePageIsland.vue"),
  hydrate: "idle",
});

export const YearPageIsland = defineIsland<JsonObject>("year-page", {
  load: () => import("./islands/YearPageIsland.vue"),
  hydrate: "idle",
});

export const SpeakerPageIsland = defineIsland<JsonObject>("speaker-page", {
  load: () => import("./islands/SpeakerPageIsland.vue"),
  hydrate: "idle",
});
