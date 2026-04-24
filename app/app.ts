import { defineApp, defineRoute } from "@vuerend/core";
import type { RouteContext } from "@vuerend/core";
import { getAllSpeakersWithYear, getSpeakersByYear } from "~~/server/data";
import { YEARS } from "~~/types";
import { getSpeakerNames, getSpeakerTalks } from "~/composables/speaker";
import { isValidYear } from "~/utils/years";
import HomeRoute from "./routes/HomeRoute";
import SpeakerRoute from "./routes/SpeakerRoute";
import YearRoute from "./routes/YearRoute";

const siteTitle = "Vue Fes Japan Speakers";

type YearRouteProps = {
  found: boolean;
  speakers: ReturnType<typeof getSpeakersByYear>;
  year: string;
};

type SpeakerRouteProps = {
  found: boolean;
  speakerName: string;
  speakers: ReturnType<typeof getSpeakerTalks>;
};

export default defineApp({
  document: {
    lang: "ja",
    title: siteTitle,
    titleTemplate: (title) =>
      title && title !== siteTitle ? `${title} - ${siteTitle}` : siteTitle,
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Sans+JP:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    meta: [
      {
        name: "description",
        content: "Vue Fes Japan歴代スピーカーまとめページ",
      },
      {
        property: "og:image",
        content: "/og-image.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "theme-color",
        content: "#f4f1eb",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#1c1c19",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    stylesheets: import.meta.env.DEV ? ["/app/assets/css/main.css"] : [],
  },
  routes: [
    defineRoute({
      path: "/",
      component: HomeRoute,
      getProps() {
        return {
          allSpeakers: getAllSpeakersWithYear(),
        };
      },
      head: {
        title: siteTitle,
      },
      render: { strategy: "ssg" },
    }),
    defineRoute({
      path: "/speakers/:name",
      component: SpeakerRoute,
      getProps(context: RouteContext<"/speakers/:name">): SpeakerRouteProps {
        const speakerName = context.params.name;
        const speakers = getSpeakerTalks(speakerName);
        return {
          found: speakers.length > 0,
          speakerName,
          speakers,
        };
      },
      head(_context, props: SpeakerRouteProps) {
        return {
          title: props.found ? `${props.speakerName} 発表一覧` : "Speaker Not Found",
        };
      },
      prerender() {
        return getSpeakerNames().map((name) => `/speakers/${encodeURIComponent(name)}`);
      },
      render: { strategy: "ssg" },
      status(_context, props: SpeakerRouteProps) {
        return props.found ? 200 : 404;
      },
    }),
    defineRoute({
      path: "/:year",
      component: YearRoute,
      getProps(context: RouteContext<"/:year">): YearRouteProps {
        const year = context.params.year;
        return {
          found: isValidYear(year),
          speakers: isValidYear(year) ? getSpeakersByYear(year) : [],
          year,
        };
      },
      head(_context, props: YearRouteProps) {
        return {
          title: props.found ? `Vue Fes Japan ${props.year}` : "Year Not Found",
        };
      },
      prerender() {
        return YEARS.map((year) => `/${year}`);
      },
      render: { strategy: "ssg" },
      status(_context, props: YearRouteProps) {
        return props.found ? 200 : 404;
      },
    }),
  ],
});
