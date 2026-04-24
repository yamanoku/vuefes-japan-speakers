# Vue Fes Japan Speakers

歴代のVue Fes Japanのスピーカーを一覧できるサイトです（パネルディスカッションやイベントスピーカーは含めておりません）。

![Vue Fes Japan Speakersのサイトスクリーンショット](./public/og-image.png)

> [!WARNING]
> このサイトはVue Fes Japan非公式の[@yamanoku](https://github.com/yamanoku)の個人プロジェクトのため、Vue Fes Japan公式サイトに関する内容については公式へ直接問い合わせください。

## 参考

このサイトを作るにあたり、以下を参考にしました。

- [RubyKaigiの2006年から2024年までの登壇者一覧を見れるWebページを作った - Eggshell](https://imaizumimr.hatenablog.com/entry/2024/08/20/204241)
  - [ima1zumi/RubyKaigi-speakers](https://github.com/ima1zumi/RubyKaigi-speakers)
- [Vue.js Japan User Group](https://github.com/vuejs-jp)
  - [Vue Fes Japan 2025](https://vuefes.jp/2025/)
  - [Vue Fes Japan 2024](https://vuefes.jp/2024/)
  - [Vue Fes Japan 2023](https://vuefes.jp/2023/)
  - [Vue Fes Japan Online 2022](https://vuefes.jp/2022/)
  - [Vue Fes Japan 2019](https://vuefes.jp/2019/)
  - [Vue Fes Japan 2018](https://vuefes.jp/2018/)

## Setup

```bash
pnpm install
```

## Commands

開発サーバやビルドなどの npm scripts は pnpm 経由で実行できます。Vite+ の `vp dev` / `vp build` も Nuxt に橋渡しされ、Format は Vite+ の `vp fmt`、Lint / Type Check は Vize 系ツールを利用します。Vize の Vue SFC compiler は Nuxt 4.4.2 の内部ルート描画との互換性を保つため、`VIZE_NUXT_COMPILER=1` の明示 opt-in で有効化します。

| 用途          | コマンド                            |
| ------------- | ----------------------------------- |
| 開発サーバ    | `pnpm dev` / `vp dev`               |
| ビルド        | `pnpm build` / `vp build`           |
| 静的生成      | `pnpm generate`                     |
| プレビュー    | `pnpm preview`                      |
| Lint          | `pnpm lint`                         |
| Format        | `pnpm fmt` / `vp fmt --write`       |
| Format Check  | `pnpm fmt:check` / `vp fmt --check` |
| Type Check    | `pnpm typecheck`                    |
| Test          | `pnpm test`                         |
| Test（watch） | `pnpm test:watch`                   |

## CI

GitHub Actions でも同じ pnpm scripts を実行します。

- `pnpm lint`
- `pnpm fmt:check`
- `pnpm typecheck`
- `pnpm test`

`pnpm fmt:check` は Vite+、`pnpm typecheck` は Rust-native Vize CLI を利用します。

## Deploy

```bash
pnpm dlx nuxthub deploy
```

## License

[CC BY-SA 4.0](./LICENSE)
