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

declare function defineArt(source: string, options: MuseaArtOptions): void;
