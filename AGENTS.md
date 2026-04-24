# AGENTS Guide (vuefes-japan-speakers)

このドキュメントは、本リポジトリで作業するエージェントや貢献者向けの実務ガイドです。セットアップ、構成、よくある変更、検証、デプロイの要点をまとめています。

## プロジェクト概要

- フレームワーク: Nuxt 4（Vue 3）
- 目的: 歴代の Vue Fes Japan スピーカーと発表タイトルを一覧できる非公式アーカイブ
- UI/スタイル: Nuxt UI 4 + Tailwind CSS 4 + カスタムコンポーネント
- ツールチェーン: Vize（Vue SFC compiler は opt-in / lint / type check）+ Vite+
- データ供給: Nuxt サーバルート（`server/api`）から年別・全件データを返却
- デプロイ: NuxtHub / Cloudflare 系の設定を利用

## 前提・セットアップ

- 推奨: Node.js LTS。CI は Node.js 24 で動作します。
- パッケージマネージャー: `pnpm@10.33.2`（`package.json` の `packageManager` を参照）
- このリポジトリでは Vite+（`vp`）経由の操作を基本にします。

```bash
curl -fsSL https://vite.plus | bash
vp install
vp config
```

`vp install` は `packageManager` を見て依存関係を入れます。`vp config` は `vite.config.ts` の設定を反映します。通常は install 時にも実行されますが、生成設定や Vite+ 設定を変更した場合は手動で実行してください。

## よく使うコマンド

| 用途          | 推奨コマンド      | npm script        |
| ------------- | ----------------- | ----------------- |
| 開発サーバ    | `vp dev`          | `pnpm dev`        |
| ビルド        | `vp build`        | `pnpm build`      |
| 静的生成      | `pnpm generate`   | `pnpm generate`   |
| プレビュー    | `pnpm preview`    | `pnpm preview`    |
| Lint          | `pnpm lint`       | `pnpm lint`       |
| Format        | `vp fmt --write`  | `pnpm fmt`        |
| Format 確認   | `vp fmt --check`  | `pnpm fmt:check`  |
| Type Check    | `pnpm typecheck`  | `pnpm typecheck`  |
| Test          | `pnpm test`       | `pnpm test`       |
| Test（watch） | `pnpm test:watch` | `pnpm test:watch` |

作業前後の検証は、変更内容に応じて `pnpm lint`、`pnpm fmt:check`、`pnpm typecheck`、`pnpm test` を組み合わせます。

## ディレクトリ構成（要点）

- `app/`
  - `app.vue`: ルート、SEO、フォント、アイコンなどの共通設定
  - `pages/`: トップ、年別一覧、スピーカー詳細ページ
  - `components/`: ヘッダー、フッター、マストヘッド、一覧・タイムライン、フィルタ UI
  - `composables/`: `useVfjsI18n`、`useColorScheme`、スピーカー取得・絞り込みロジック
  - `utils/`: 年判定、文字列ソート、スピーカー集約などのユーティリティ
  - `assets/css/main.css`: Tailwind 読み込み、フォント、カラートークン、フォーカススタイル
- `server/`
  - `api/`: `/api/speakers` と `/api/speakers/[year]`
  - `data/`: 年別スピーカーデータと集約ロジック
- `types/`: `SpeakerInfo`、`SpeakerWithYear`、`YEARS` などの共有型
- `public/`: ロゴ、favicon、OG 画像などの静的ファイル
- `pnpm-workspace.yaml`: catalog と依存バージョンの定義
- `nuxt.config.ts`: Nuxt モジュール、Nitro、NuxtHub、Vize 設定
- `vite.config.ts`: Vite+ の lint / format / `vp dev` / `vp build` 設定
- `vitest.config.ts`: Nuxt テスト環境と happy-dom 設定
- `tsconfig.vize.json`: Vize 型チェック用の TS 設定

## API とデータ

- 全件: `server/api/speakers.ts`
- 年別: `server/api/speakers/[year].ts`
- データ源: `server/data/speakers-YYYY.ts`
- 集約: `server/data/index.ts`
- 有効年: `types/index.ts` の `YEARS`

現在の有効年は `2018`、`2019`、`2022`、`2023`、`2024`、`2025` です。2020 年と 2021 年は含まれていません。

### 新しい開催年を追加するとき

- `server/data/speakers-YYYY.ts` を作成し、`SpeakerInfo[]` に沿ってデータを定義する。
- `server/data/index.ts` に import と `speakersByYear` のエントリを追加する。
- `types/index.ts` の `YEARS` に年を追加する。UI の年表示はこの値を参照します。
- `server/api/speakers/[year].test.ts` の有効年・エラーメッセージ期待値を更新する。
- 必要に応じて `README.md` の参考リンクも更新する。
- `/`、`/[year]`、`/speakers/[name]` で表示とリンクを確認する。

## UI/ページの要点

- ルーティング:
  - `app/pages/index.vue`: 全体ビュー。タイムライン表示と一覧表示を切り替えます。
  - `app/pages/[year]/index.vue`: 年別一覧ページ
  - `app/pages/speakers/[name]/index.vue`: スピーカー詳細ページ
- 主要コンポーネント:
  - `AppHeader.vue`: ナビゲーション、言語切替、配色切替
  - `AppMasthead.vue`: トップページの概要・統計表示
  - `ChronicleView.vue`: 年別タイムライン表示
  - `DirectoryView.vue`: スピーカー単位の一覧。並び替えと開閉行を持ちます。
  - `SpeakerFilterBar.vue` / `YearFilterBar.vue`: 検索・年フィルタ UI
  - `AppFooter.vue`: フッター
- 表示状態:
  - トップページの view は `localStorage('vfjs:view')` に保存されます。
  - density は `localStorage('vfjs:density')` に保存されます。
  - 言語は `localStorage('vfjs:lang')` に保存されます。

## カラースキーム

`useColorScheme` composable で `light` / `dark` / `system` を管理します。

- デフォルト: `system`
- 保存先: `localStorage('vfjs:color-scheme')`
- 適用方法:
  - `system`: `document.documentElement` の `data-color-scheme` 属性を削除し、`prefers-color-scheme` に委ねる。
  - `light` / `dark`: `data-color-scheme="light"` または `data-color-scheme="dark"` をセットする。
- CSS 定義: `app/assets/css/main.css`
  - `@import 'tailwindcss' theme(static);`
  - `--paper`、`--ink`、`--accent`、`--rule` などの CSS カスタムプロパティを定義します。

## Vize / Lint / 型チェック

- Compiler: `@vizejs/nuxt` を `nuxt.config.ts` に組み込みます。Nuxt 4.4.2 の内部ルート描画との互換性を保つため、Vize の Vue SFC compiler は `VIZE_NUXT_COMPILER=1` の明示 opt-in で有効化します。
- Lint: `vite.config.ts` の `lint` 設定を `scripts/oxlint-vize.mjs` から `oxlint-vize` に渡し、TS/JS の Oxlint ルールと Vize の Vue 診断をまとめて実行します。
- 型チェック: `scripts/vize-typecheck.mjs` から Rust binary の `vize check --tsconfig tsconfig.vize.json` を明示的な TS 入力で実行します。
- 設定: `vite.config.ts` に Lint / Format / `vp dev` / `vp build` の設定を集約します。

## テスト

- ランナー: Vitest
- DOM: Nuxt テスト環境 + happy-dom
- 設定: `vitest.config.ts`
- テスト位置:
  - `app/**.test.ts`
  - `server/**.test.ts`
- 実行:

```bash
pnpm test
```

ウォッチ実行は `pnpm test:watch` を使います。

### テスト方針

- ユニットテストは入出力と副作用の最小検証に集中する。
- API ルートは有効値、境界値、異常系を確認する。
- 年追加時は `YEARS`、API のエラーメッセージ、UI 側の年表示が連動しているか確認する。

## 型チェックと lint

- 型チェック: `pnpm typecheck`
- Lint: `pnpm lint`
- Format: `pnpm fmt`
- Format 確認: `pnpm fmt:check`

型エラーを隠すための型削除や過度な型アサーションは避け、原因を直してください。

## 典型タスクの手順

### スピーカー検索/フィルタを調整

- `SpeakerFilterBar.vue`、`YearFilterBar.vue`、`DirectoryView.vue`、`ChronicleView.vue` を確認する。
- 取得・絞り込みロジックが必要なら `app/composables/speaker.ts` を更新する。
- スピーカー集約や日本語判定に関わる場合は `app/utils/speakerMap.ts`、`app/utils/stringCollate.ts` も確認する。
- 影響範囲のテストを更新する。

### コンポーネントを追加

- `app/components/` に追加し、該当ページで利用する。
- 既存の CSS カスタムプロパティと Tailwind ユーティリティに合わせる。
- グローバルな見た目やフォーカススタイルは `app/assets/css/main.css` を確認する。
- UI の振る舞いは小さな単位でテストする。

### 表示文言や言語切替を変更

- 文言は `app/composables/useVfjsI18n.ts` の `translations` を更新する。
- `ja` と `en` の両方を揃える。
- スピーカー名の英語表記はデータ側の `nameEn` を確認する。

## CI

GitHub Actions は Vite+ セットアップ後に以下を実行します。

- `pnpm lint`
- `pnpm fmt:check`
- `pnpm typecheck`
- `pnpm test`

CI の対象 path は `app/**`、`server/**`、`types/**`、各種設定ファイル、lockfile などです。ドキュメントのみの変更では一部の workflow が走らない場合があります。

## デプロイ

NuxtHub へのデプロイは以下を使います。

```bash
vpx nuxthub deploy
```

NuxtHub / Cloudflare 関連の依存は `pnpm-workspace.yaml` の `cloudflare` catalog にまとまっています。

## 開発フロー（推奨）

- ブランチ: `feat/*`、`fix/*`、`chore/*`、`docs/*` など用途別に作成する。
- コミット: Conventional Commits を使う。例: `docs: update agents guide`
- 実装: 小さめの差分で進め、関連テストやドキュメントも合わせて更新する。
- 検証: 変更内容に応じて `pnpm lint && pnpm fmt:check && pnpm typecheck && pnpm test` を実行する。
- レビュー: 変更点の要約、確認したコマンド、必要に応じてスクリーンショットや再現手順を添える。

## トラブルシュート

- 依存関係の不整合: `vp install` を実行し、必要なら `vp config` も実行する。
- パッケージマネージャーの確認: `pnpm -v` で `10.33.2` 系か確認する。
- 型エラー: `pnpm typecheck` で原因を洗い出し、型定義・import・データ構造を直す。
- Nuxt 生成物の不整合: 開発サーバを再起動し、必要なら `vp config` を再実行する。
- テスト環境の差異: `vitest.config.ts` の Nuxt 環境と happy-dom 設定を確認する。
