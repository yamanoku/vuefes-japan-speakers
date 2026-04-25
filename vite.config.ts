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
import vize from "@vizejs/vite-plugin";
import { vuerend } from "@vuerend/core/vite";
import type { Plugin } from "vite";
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

const lint = {
  $schema: "./node_modules/oxlint/configuration_schema.json",
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
  ignorePatterns,
};

export { fmt, lint };

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

export default defineConfig({
  plugins: [
    tailwindcss(),
    vuerend({
      app: "./app/app.ts",
      islands: "./app/islands.ts",
      vuePlugin: vize({
        scanPatterns: ["app/**/*.vue"],
        ignorePatterns: ["node_modules/**", "dist/**", ".cache/**"],
      }),
    }),
    staticHtmlPreview(),
    cloudflarePages404(),
  ],
  resolve: {
    alias: {
      // Vize SSR imports the package root; Vite's module runner needs the ESM build.
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
        command: "vp lint . && vp run typecheck",
      },
      typecheck: {
        command: "vize check --servers 1 --tsconfig tsconfig.vize.json",
      },
    },
  },
  fmt,
  lint,
});
