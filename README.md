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
vp install
vp config
```

## Commands

Vuerend / Vite のアプリとして動きます。Vue SFC compiler、lint、type check には Vize 0.65.0 系を使い、format と test は Vite+ 経由で実行します。

| 用途          | コマンド                              |
| ------------- | ------------------------------------- |
| 開発サーバ    | `pnpm dev` / `vp run dev`             |
| ビルド        | `pnpm build` / `vp run build`         |
| 静的生成      | `pnpm generate`                       |
| プレビュー    | `pnpm preview`                        |
| Lint          | `pnpm lint`                           |
| Format        | `pnpm fmt` / `vp fmt .`               |
| Format Check  | `pnpm fmt:check` / `vp fmt . --check` |
| Type Check    | `pnpm typecheck`                      |
| Test          | `pnpm test`                           |
| Test（watch） | `pnpm test:watch`                     |

## CI

GitHub Actions でも同じ pnpm scripts を実行します。

- `pnpm lint`
- `pnpm fmt:check`
- `pnpm typecheck`
- `pnpm test`

## Deploy

`pnpm generate` で `dist/client` に静的ファイルを生成します。生成後の確認には `pnpm preview` を使います。

```bash
pnpm generate
pnpm preview
```

## License

[CC BY-SA 4.0](./LICENSE)
