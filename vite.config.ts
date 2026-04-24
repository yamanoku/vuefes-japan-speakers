import { spawn, spawnSync } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { createServer, connect } from 'node:net';

import { defineConfig } from 'vite-plus';

const VITE_PLUS_NUXT_BRIDGE = 'VITE_PLUS_NUXT_BRIDGE';
const NUXT_DEV_HOST = '127.0.0.1';
const NUXT_DEV_PORT = 3100;
const PUBLIC_NUXT_BUILD_ENTRY = 'virtual:nuxt-vp-build-entry';
const RESOLVED_NUXT_BUILD_ENTRY = `\0${PUBLIC_NUXT_BUILD_ENTRY}`;

const ignorePatterns = [
  '**/.output/**',
  '**/.data/**',
  '**/.nuxt/**',
  '**/.nitro/**',
  '**/.cache/**',
  '**/dist/**',
  '**/node_modules/**',
  '**/public/**',
  '**/__agent_only/**',
  '**/__oxlint_plugin_vize_temp__/**',
];

const lint = {
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'oxc', 'import', 'unicorn', 'vue'] as [
    'typescript',
    'oxc',
    'import',
    'unicorn',
    'vue',
  ],
  jsPlugins: ['oxlint-plugin-vize'],
  settings: {
    vize: {
      preset: 'nuxt',
      helpLevel: 'short',
    },
  },
  env: {
    builtin: true,
    browser: true,
    node: true,
    es2024: true,
  },
  ignorePatterns,
  rules: {
    'vize/vue/require-v-for-key': 'error',
    'vize/vue/no-v-html': 'warn',
    'vize/vue/no-unused-vars': 'warn',
    'vize/vue/valid-v-bind': 'error',
    'vize/vue/valid-v-for': 'error',
    'vize/vue/valid-v-if': 'error',
    'vize/vue/valid-v-model': 'error',
    'vize/vue/valid-v-on': 'error',
    'vize/vue/valid-v-slot': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    'import/no-duplicates': 'error',
    'typescript/no-explicit-any': 'error',
  } as const,
};

const fmt = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all' as const,
  htmlWhitespaceSensitivity: 'ignore' as const,
  sortPackageJson: true,
  ignorePatterns,
};

const waitForPort = async (port: number, timeoutMs = 60_000) => {
  const startedAt = Date.now();

  await new Promise<void>((resolve, reject) => {
    const tryConnect = () => {
      const socket = connect({ host: NUXT_DEV_HOST, port });
      let settled = false;

      const retry = () => {
        if (settled) {
          return;
        }

        settled = true;
        socket.destroy();

        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for Nuxt dev server on port ${port}.`));
          return;
        }

        setTimeout(tryConnect, 250);
      };

      socket.setTimeout(1_000);
      socket.once('connect', () => {
        settled = true;
        socket.destroy();
        resolve();
      });
      socket.once('error', retry);
      socket.once('timeout', retry);
    };

    tryConnect();
  });
};

const findAvailablePort = async (startPort: number) => {
  for (let port = startPort; port < startPort + 100; port += 1) {
    const available = await new Promise<boolean>((resolve) => {
      const server = createServer();

      server.unref();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port, NUXT_DEV_HOST);
    });

    if (available) {
      return port;
    }
  }

  throw new Error(`No available Nuxt dev port found from ${startPort}.`);
};

const statusText = (code: number | null, signal: NodeJS.Signals | null) =>
  signal ? `signal ${signal}` : `exit code ${code ?? 1}`;

const stopChild = (child: ChildProcess | undefined) => {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
};

const hasCliOption = (option: string) =>
  process.argv.includes(option) || process.argv.some((arg) => arg.startsWith(`${option}=`));

const runNuxtBuild = () => {
  const result = spawnSync('pnpm', ['exec', 'nuxt', 'build'], {
    env: {
      ...process.env,
      [VITE_PLUS_NUXT_BRIDGE]: '1',
    },
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Nuxt build failed with ${statusText(result.status, result.signal)}.`);
  }
};

const nuxtVpBridge = () => {
  let command: 'serve' | 'build' = 'serve';
  let nuxtDevPort = NUXT_DEV_PORT;
  let nuxtDevProcess: ChildProcess | undefined;
  let stoppingNuxtDev = false;

  return {
    name: 'nuxt-vp-bridge',
    async config(_config, env) {
      command = env.command;

      if (process.env[VITE_PLUS_NUXT_BRIDGE] === '1') {
        return;
      }

      if (process.env.VP_COMMAND === 'dev' && env.command === 'serve') {
        nuxtDevPort = await findAvailablePort(NUXT_DEV_PORT);

        return {
          server: {
            ...(!hasCliOption('--port') && { port: 3000 }),
            proxy: {
              '^/': {
                target: `http://${NUXT_DEV_HOST}:${nuxtDevPort}`,
                changeOrigin: true,
                ws: true,
              },
            },
          },
        };
      }

      if (process.env.VP_COMMAND === 'build' && env.command === 'build') {
        runNuxtBuild();

        return {
          appType: 'custom',
          publicDir: false,
          build: {
            write: false,
            rollupOptions: {
              input: PUBLIC_NUXT_BUILD_ENTRY,
            },
          },
        };
      }
    },
    configResolved(config) {
      command = config.command;
    },
    resolveId(id) {
      if (id === PUBLIC_NUXT_BUILD_ENTRY || id === RESOLVED_NUXT_BUILD_ENTRY) {
        return RESOLVED_NUXT_BUILD_ENTRY;
      }
    },
    load(id) {
      if (id === RESOLVED_NUXT_BUILD_ENTRY) {
        return 'export default {};';
      }
    },
    async configureServer(server) {
      if (
        process.env[VITE_PLUS_NUXT_BRIDGE] === '1' ||
        process.env.VP_COMMAND !== 'dev' ||
        command !== 'serve'
      ) {
        return;
      }

      nuxtDevProcess = spawn(
        'pnpm',
        ['exec', 'nuxt', 'dev', '--host', NUXT_DEV_HOST, '--port', String(nuxtDevPort)],
        {
          env: {
            ...process.env,
            [VITE_PLUS_NUXT_BRIDGE]: '1',
          },
          shell: process.platform === 'win32',
          stdio: 'inherit',
        },
      );

      const exitBeforeReady = new Promise<never>((_, reject) => {
        nuxtDevProcess?.once('exit', (code, signal) => {
          if (!stoppingNuxtDev) {
            reject(new Error(`Nuxt dev failed with ${statusText(code, signal)}.`));
          }
        });
      });

      await Promise.race([waitForPort(nuxtDevPort), exitBeforeReady]);

      const stopNuxtDev = () => {
        stoppingNuxtDev = true;
        stopChild(nuxtDevProcess);
      };

      server.httpServer?.once('close', stopNuxtDev);
      process.once('exit', stopNuxtDev);
    },
  };
};

export { fmt, lint };

export default defineConfig({
  plugins: [nuxtVpBridge()],
  fmt,
  lint,
});
