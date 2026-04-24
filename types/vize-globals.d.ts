import type { $Fetch } from 'ofetch';

declare global {
  const $fetch: $Fetch;

  interface ImportMeta {
    client: boolean;
    server: boolean;
    dev: boolean;
  }
}

export {};
