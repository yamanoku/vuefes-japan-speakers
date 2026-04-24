# Vue Fes Japan Speakers

歴代のVue Fes Japanのスピーカーを一覧できるサイトです（イベントスピーカーは含めておりません）。

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

[Vite+](https://viteplus.dev/)（`vp`）を利用します。`vp install` は `package.json` の `packageManager` を参照して、必要なパッケージマネージャーを選択します。

```bash
curl -fsSL https://vite.plus | bash
vp install
vp config
```

`vp config` は vite-plus の設定を反映します。通常は install 時にも実行されますが、`vite.config.ts` を変更したときや生成設定が足りないときは手動で実行してください。

## Commands

開発サーバやビルドなどの npm scripts も、Lint / Format / Type Check / Test も `vp` 経由で実行します。

| 用途          | コマンド          |
| ------------- | ----------------- |
| 開発サーバ    | `vp run dev`      |
| ビルド        | `vp run build`    |
| 静的生成      | `vp run generate` |
| プレビュー    | `vp run preview`  |
| Lint          | `vp lint .`       |
| Format        | `vp fmt .`        |
| Type Check    | `vp check`        |
| Test          | `vp test run`     |
| Test（watch） | `vp test`         |

## CI

GitHub Actions でも同じ `vp` コマンドを実行します。

- `vp lint .`
- `vp fmt . --check`
- `vp check`
- `vp test run`

## Deploy

```bash
vpx nuxthub deploy
```

## License

[CC BY-SA 4.0](./LICENSE)
