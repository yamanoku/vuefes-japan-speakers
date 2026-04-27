import { defineApp, defineRoute } from "@vuerend/core";
import type { RouteContext } from "@vuerend/core";
import { getAllSpeakersWithYear, getSpeakersByYear } from "../server/data";
import { YEARS } from "../types";
import { getSpeakerNames, getSpeakerTalks } from "./composables/speaker";
import { isValidYear } from "./utils/years";
import HomeRoute from "./routes/HomeRoute.vue";
import NotFoundRoute from "./routes/NotFoundRoute.vue";
import SpeakerRoute from "./routes/SpeakerRoute.vue";
import YearRoute from "./routes/YearRoute.vue";

const siteTitle = "Vue Fes Japan Speakers";
const siteDescription = "Vue Fes Japan歴代スピーカーまとめページ";
const siteUrl = "https://vuefes-japan-speakers.yamanoku.net/";
const ogImageUrl = new URL("/og-image.png", siteUrl).toString();

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
        content: siteDescription,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: siteUrl,
      },
      {
        property: "og:title",
        content: siteTitle,
      },
      {
        property: "og:description",
        content: siteDescription,
      },
      {
        property: "og:image",
        content: ogImageUrl,
      },
      {
        property: "og:image:secure_url",
        content: ogImageUrl,
      },
      {
        property: "og:image:type",
        content: "image/png",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: siteTitle,
      },
      {
        name: "twitter:description",
        content: siteDescription,
      },
      {
        name: "twitter:image",
        content: ogImageUrl,
      },
      {
        name: "twitter:image:alt",
        content: siteTitle,
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
      path: "/404.html",
      component: NotFoundRoute,
      head: {
        title: "Page Not Found",
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
