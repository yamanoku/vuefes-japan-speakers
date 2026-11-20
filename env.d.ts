declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<object, object, unknown>;
  export default component;
}

type MuseaArtOptions = {
  title: string;
  category?: string;
  status?: string;
  tags?: string[];
};

type MuseaComponent =
  | (abstract new (...args: never[]) => { $props: unknown })
  | ((...args: never[]) => unknown);

declare function defineArtMeta(options: MuseaArtOptions): void;
declare function defineArt(component: MuseaComponent, options?: MuseaArtOptions): void;
