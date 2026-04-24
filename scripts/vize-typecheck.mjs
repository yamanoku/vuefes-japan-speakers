import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['app', 'server', 'types'];
const explicitInputs = ['.nuxt/types/imports.d.ts', 'vite.config.ts'];
const sourceExtensions = ['.ts', '.tsx', '.mts', '.cts', '.d.ts'];

const isSourceFile = (filePath) =>
  sourceExtensions.some((extension) => filePath.endsWith(extension)) &&
  !filePath.endsWith('.test.ts') &&
  !filePath.endsWith('.test.tsx');

const collectSourceFiles = (dir) => {
  if (!existsSync(dir)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filePath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(filePath));
    } else if (entry.isFile() && isSourceFile(filePath)) {
      files.push(filePath);
    }
  }
  return files;
};

const inputs = [
  ...explicitInputs.filter((filePath) => existsSync(filePath)),
  ...roots.flatMap(collectSourceFiles),
].sort();

const result = spawnSync('vize', ['check', '--tsconfig', 'tsconfig.vize.json', ...inputs], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
