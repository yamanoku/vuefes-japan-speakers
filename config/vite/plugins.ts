import {
  createReadStream,
  existsSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, relative, resolve, sep } from "node:path";
import { musea } from "@vizejs/vite-plugin-musea";
import type { MuseaOptions } from "@vizejs/vite-plugin-musea";
import type { ConfigEnv, Plugin, UserConfig } from "vite";

export function staticHtmlPreview(): Plugin {
  return {
    name: "vfjs:static-html-preview",
    configurePreviewServer(server) {
      const previewOutDir = resolve(server.config.root, server.config.build.outDir);

      const sendHtml = (
        request: IncomingMessage,
        response: ServerResponse,
        htmlFile: string,
        statusCode: number,
      ) => {
        const htmlStat = statSync(htmlFile);
        if (!htmlStat.isFile()) {
          return false;
        }

        response.statusCode = statusCode;
        response.setHeader("Content-Type", "text/html;charset=utf-8");
        response.setHeader("Content-Length", htmlStat.size);

        if (request.method === "HEAD") {
          response.end();
        } else {
          createReadStream(htmlFile).pipe(response);
        }

        return true;
      };

      server.middlewares.use((request, response, next) => {
        if (request.method !== "GET" && request.method !== "HEAD") {
          next();
          return;
        }

        if (!request.url) {
          next();
          return;
        }

        const url = new URL(request.url, "http://localhost");
        if (extname(url.pathname) !== "") {
          next();
          return;
        }

        const pathname = url.pathname.replace(/\/+$/, "");
        const htmlPathname = pathname === "" ? "/index.html" : `${pathname}/index.html`;
        const htmlFile = resolve(previewOutDir, `.${htmlPathname}`);
        const notFoundFile = resolve(previewOutDir, "404.html");
        const relativeHtmlFile = relative(previewOutDir, htmlFile);

        if (
          relativeHtmlFile !== "" &&
          !relativeHtmlFile.startsWith("..") &&
          !relativeHtmlFile.startsWith(sep) &&
          existsSync(htmlFile) &&
          sendHtml(request, response, htmlFile, 200)
        ) {
          return;
        }

        if (existsSync(notFoundFile) && sendHtml(request, response, notFoundFile, 404)) {
          return;
        }

        next();
      });
    },
  };
}

export function cloudflarePages404(): Plugin {
  let root = process.cwd();

  return {
    name: "vfjs:cloudflare-pages-404",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async buildApp() {
      write404Html();
    },
    closeBundle() {
      write404Html();
    },
  };

  function write404Html() {
    const clientOutDir = resolve(root, "dist/client");
    const generated404 = resolve(clientOutDir, "404.html/index.html");
    const target404 = resolve(clientOutDir, "404.html");

    if (!existsSync(generated404)) {
      return;
    }

    const html = readFileSync(generated404);
    rmSync(target404, { force: true, recursive: true });
    writeFileSync(target404, html);
  }
}

const museaOptions = {
  include: ["src/**/*.art.vue"],
  exclude: ["node_modules/**", "dist/**", ".cache/**"],
  basePath: "/__musea__",
  inlineArt: false,
  previewCss: ["src/assets/css/main.css"],
  theme: "system",
  vrt: {
    viewports: [
      { name: "mobile", width: 390, height: 844 },
      { name: "desktop", width: 1280, height: 720 },
    ],
  },
} satisfies MuseaOptions;

export function museaGallery(): Plugin[] {
  return musea(museaOptions).map(applyMuseaInServeCommand);
}

function applyMuseaInServeCommand(plugin: Plugin): Plugin {
  return {
    ...plugin,
    apply(config, env) {
      if (env.command !== "serve") {
        return false;
      }
      return shouldApplyPlugin(plugin, config, env);
    },
  };
}

function shouldApplyPlugin(plugin: Plugin, config: UserConfig, env: ConfigEnv): boolean {
  if (typeof plugin.apply === "function") {
    return plugin.apply(config, env);
  }
  if (plugin.apply) {
    return plugin.apply === env.command;
  }
  return env.command === "serve";
}
