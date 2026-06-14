import { Buffer } from "node:buffer";
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
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { musea } from "@vizejs/vite-plugin-musea";
import { vuerend } from "@vuerend/core/vite";
import type { OxlintConfig } from "oxlint";
import type { Plugin } from "vite";
import type { PluginOption } from "vite-plus";
import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const ignorePatterns = [
  "**/.cache/**",
  "**/.data/**",
  "**/.nuxt/**",
  "**/.nitro/**",
  "**/.output/**",
  "**/dist/**",
  "**/node_modules/**",
  "**/public/**",
];
const fmtIgnorePatterns = [...ignorePatterns, "**/*.vue"];

const lint: OxlintConfig = {
  plugins: ["typescript", "oxc", "import", "unicorn", "vue"] as [
    "typescript",
    "oxc",
    "import",
    "unicorn",
    "vue",
  ],
  jsPlugins: ["oxlint-plugin-vize"],
  settings: {
    vize: {
      preset: "opinionated",
      helpLevel: "short",
    },
  },
  env: {
    builtin: true,
    browser: true,
    es2024: true,
    node: true,
  },
  ignorePatterns,
  rules: {
    "vize/vue/require-v-for-key": "error",
    "vize/vue/no-v-html": "warn",
    "vize/vue/no-unused-vars": "warn",
    "vize/vue/valid-v-bind": "error",
    "vize/vue/valid-v-for": "error",
    "vize/vue/valid-v-if": "error",
    "vize/vue/valid-v-model": "error",
    "vize/vue/valid-v-on": "error",
    "vize/vue/valid-v-slot": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "warn",
    "import/no-duplicates": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-explicit-any": "error",
    "vue/no-arrow-functions-in-watch": "error",
    "vue/no-export-in-script-setup": "error",
    "vue/no-lifecycle-after-await": "error",
    "vue/prefer-import-from-vue": "error",
    "vue/valid-define-emits": "error",
    "vue/valid-define-props": "error",
  } as const,
  globals: {
    defineEmits: "readonly",
    defineExpose: "readonly",
    defineProps: "readonly",
    withDefaults: "readonly",
  },
};

const fmt = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all" as const,
  htmlWhitespaceSensitivity: "ignore" as const,
  sortPackageJson: true,
  ignorePatterns: fmtIgnorePatterns,
};

export { fmt, lint };

const museaGalleryFrameCss = `

/* Vue Fes Japan: keep Musea previews close to app desktop rendering. */
.variant-preview {
  aspect-ratio: auto !important;
  align-items: stretch !important;
  justify-content: center !important;
  min-height: 720px !important;
  overflow: auto !important;
  padding: 24px !important;
}

.variant-preview iframe {
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: 672px !important;
  max-height: none !important;
  border-radius: var(--musea-radius-md);
  flex-shrink: 0;
}

.variants-view {
  grid-template-columns: minmax(0, 1fr) !important;
}

.variant-preview-area,
.variant-section,
.variant-card {
  width: 100% !important;
}

.variant-toc-column {
  display: none !important;
}

.content-inner {
  max-width: 1720px;
}
`;

function staticHtmlPreview(): Plugin {
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

function cloudflarePages404(): Plugin {
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

function museaGalleryFrameLayout(): Plugin {
  return {
    name: "vfjs:musea-gallery-frame-layout",
    enforce: "pre",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!isMuseaGalleryCssRequest(request)) {
          next();
          return;
        }

        delete request.headers["if-none-match"];
        delete request.headers["if-modified-since"];

        const chunks: Buffer[] = [];
        const originalEnd = response.end.bind(response) as (
          chunk?: string | Uint8Array,
          encodingOrCallback?: BufferEncoding | (() => void),
          callback?: () => void,
        ) => ServerResponse;

        response.write = ((chunk: unknown, encoding?: BufferEncoding) => {
          chunks.push(toBuffer(chunk, encoding));
          return true;
        }) as ServerResponse["write"];

        response.end = ((chunk?: unknown, encodingOrCallback?: BufferEncoding | (() => void)) => {
          if (chunk !== undefined) {
            chunks.push(
              toBuffer(
                chunk,
                typeof encodingOrCallback === "string" ? encodingOrCallback : undefined,
              ),
            );
          }

          const css = Buffer.concat(chunks).toString("utf8");
          if (!css || response.statusCode >= 300) {
            return originalEnd();
          }

          const body = `${css}${museaGalleryFrameCss}`;
          response.setHeader("Cache-Control", "no-store");
          response.setHeader("Content-Length", Buffer.byteLength(body));

          if (typeof encodingOrCallback === "function") {
            return originalEnd(body, encodingOrCallback);
          }
          return originalEnd(body, "utf8");
        }) as ServerResponse["end"];

        next();
      });
    },
  };
}

function isMuseaGalleryCssRequest(request: IncomingMessage) {
  const pathname = request.url?.split("?")[0] ?? "";
  return pathname.startsWith("/__musea__/assets/index-") && pathname.endsWith(".css");
}

function toBuffer(chunk: unknown, encoding?: BufferEncoding) {
  if (Buffer.isBuffer(chunk)) {
    return chunk;
  }
  if (chunk instanceof Uint8Array) {
    return Buffer.from(chunk);
  }
  return Buffer.from(String(chunk), encoding);
}

function museaGallery(): Plugin[] {
  return musea({
    include: ["app/**/*.art.vue"],
    exclude: ["node_modules/**", "dist/**", ".cache/**"],
    basePath: "/__musea__",
    inlineArt: false,
    previewCss: ["app/assets/css/main.css", "app/assets/css/musea.css"],
    theme: "system",
    vrt: {
      viewports: [
        { name: "mobile", width: 390, height: 844 },
        { name: "desktop", width: 1280, height: 720 },
      ],
    },
  }).map((plugin) => ({
    ...plugin,
    apply(config, env) {
      if (env.mode === "test") {
        return false;
      }
      if (typeof plugin.apply === "function") {
        return plugin.apply(config, env);
      }
      if (plugin.apply) {
        return plugin.apply === env.command;
      }
      return env.command === "serve";
    },
  }));
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    museaGalleryFrameLayout(),
    ...museaGallery(),
    vuerend({
      app: "./app/app.ts",
      islands: "./app/islands.ts",
    }),
    staticHtmlPreview(),
    cloudflarePages404(),
  ] as PluginOption[],
  resolve: {
    alias: {
      // Keep the SSR renderer on the ESM entry for Vite's module runner.
      "@vue/server-renderer": fileURLToPath(
        new URL(
          "./node_modules/@vue/server-renderer/dist/server-renderer.esm-bundler.js",
          import.meta.url,
        ),
      ),
    },
  },
  staged: {
    "*": "vp run check",
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
  run: {
    tasks: {
      check: {
        command: "vp lint . && vp run format:check && vp run typecheck",
      },
      format: {
        command:
          "vp fmt . --write && vize fmt --write $(find app -name '*.vue' ! -name '*.art.vue')",
      },
      "format:check": {
        command:
          "vp fmt . --check && vize fmt --check $(find app -name '*.vue' ! -name '*.art.vue')",
      },
      typecheck: {
        command: "vize check --tsconfig tsconfig.vize.json",
      },
    },
  },
  fmt,
  lint,
});
