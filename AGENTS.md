# AGENTS Guide (vuefes-japan-speakers)

このドキュメントは、本リポジトリで作業するエージェントや貢献者向けの実務ガイドです。セットアップ、構成、よくある変更、検証の要点をまとめています。

## プロジェクト概要

- フレームワーク: vuerend（Vue 3 / Vite）
- 目的: 歴代の Vue Fes Japan スピーカーと発表タイトルを一覧できる非公式アーカイブ
- UI/スタイル: Tailwind CSS 4 + カスタムコンポーネント
- ツールチェーン: Vize 0.65.0 系（Vue SFC compiler / lint / type check）+ Vite+
- データ供給: `server/data` の静的データを vuerend ルートの props として渡す

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

| 用途          | 推奨コマンド                      |
| ------------- | --------------------------------- |
| 開発サーバ    | `vp dev`                          |
| ビルド        | `vp build`                        |
| 静的生成      | `vp build`                        |
| プレビュー    | `vp preview --outDir dist/client` |
| Lint          | `vp lint .`                       |
| Format        | `vp fmt .`                        |
| Format 確認   | `vp fmt . --check`                |
| Type Check    | `vp run typecheck`                |
| Test          | `vp test run`                     |
| Test（watch） | `vp test watch`                   |

作業前後の検証は、変更内容に応じて `vp lint .`、`vp fmt . --check`、`vp run typecheck`、`vp test run` を組み合わせます。

## ディレクトリ構成（要点）

- `app/`
  - `app.ts`: vuerend アプリとルート定義
  - `routes/`: ルートコンポーネント
  - `islands/`: クライアントで hydrate するページ island
  - `island-definitions.ts`: island 定義
  - `islands.ts`: クライアント island レジストリ
  - `components/`: ヘッダー、フッター、マストヘッド、一覧・タイムライン、フィルタ UI
  - `composables/`: `useVfjsI18n`、`useColorScheme`、スピーカー取得・絞り込みロジック
  - `utils/`: 年判定、文字列ソート、スピーカー集約などのユーティリティ
  - `assets/css/main.css`: Tailwind 読み込み、フォント、カラートークン、フォーカススタイル
- `server/`
  - `data/`: 年別スピーカーデータ（`speakers-YYYY.ts`）と集約ロジック
- `types/`: `SpeakerInfo`、`SpeakerWithYear`、`YEARS` などの共有型
- `public/`: ロゴ、favicon、OG 画像などの静的ファイル
- `pnpm-workspace.yaml`: catalog と依存バージョンの定義
- `vite.config.ts`: Vite / vuerend / Vite+ / Vize lint / Vitest Browser Mode / `vp run` task 設定
- `tsconfig.json`, `tsconfig.vize.json`: TypeScript と Vize 型チェック設定

## ルートとデータ

- 全件: `app/app.ts` の `/` ルートで `getAllSpeakersWithYear()` を渡す
- 年別: `app/app.ts` の `/:year` ルートで `getSpeakersByYear(year)` を渡す
- スピーカー別: `app/app.ts` の `/speakers/:name` ルートで `getSpeakerTalks(name)` を渡す
- データ源: `server/data/speakers-YYYY.ts`
- 集約: `server/data/index.ts`
- 有効年: `types/index.ts` の `YEARS`
- パネルディスカッションは `SpeakerInfo` の `format: "panel"` で表現します。

現在の有効年は `2018`、`2019`、`2022`、`2023`、`2024`、`2025` です。2020 年と 2021 年は含まれていません。

### 新しい開催年を追加するとき

- `server/data/speakers-YYYY.ts` を作成し、`SpeakerInfo[]` に沿ってデータを定義する。
- `server/data/index.ts` に import と `speakersByYear` のエントリを追加する。
- `types/index.ts` の `YEARS` に年を追加する。UI の年表示はこの値を参照します。
- `server/data/index.test.ts` や該当 island のテストで props と表示が期待通りか検証する。
- 必要に応じて `README.md` の参考リンクも更新する。
- `/`、`/[year]`、`/speakers/[name]` で表示とリンクを確認する。

## UI/ページの要点

- ルーティング:
  - `app/routes/HomeRoute.vue`: 全体一覧ページ
  - `app/routes/YearRoute.vue`: 年別一覧ページ
  - `app/routes/SpeakerRoute.vue`: スピーカー詳細ページ
- ページ island:
  - `HomePageIsland.vue`: 全体一覧のインタラクション
  - `YearPageIsland.vue`: 年別一覧のインタラクション
  - `SpeakerPageIsland.vue`: スピーカー詳細のインタラクション
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
- スタイル: Tailwind CSS 4 ユーティリティ + CSS カスタムプロパティ（`var(--paper)`, `var(--ink)`, `var(--accent)` 等）

## Vize / Lint / 型チェック

- Compiler: `@vizejs/vite-plugin` を `vite.config.ts` で vuerend の `vuePlugin` として渡します。
- Lint: `vite.config.ts` の `lint` 設定を `vp lint .` で読み込み、TS/JS の Oxlint ルールと Vize の Vue 診断をまとめて実行します。
- 型チェック: `vize check --tsconfig tsconfig.vize.json` を `vp run typecheck` 経由で実行します。
- Vize 関連 package は `pnpm-workspace.yaml` の `vize` catalog にまとめます。

## テスト

- ランナー: Vitest（Vite+ 経由）
- 実行環境: Vitest Browser Mode（Playwright / Chromium）
- 設定: `vite.config.ts`
- テスト位置:
  - `app/**.test.ts`
  - `server/**.test.ts`
- 実行:

```bash
vp test run
```

ウォッチ実行は `vp test watch` を使います。

### テスト方針

- ユニットテストは入出力と副作用の最小検証に集中する。
- データ取得ロジックは有効値、境界値、異常系を確認する。
- 年追加時は `YEARS`、データ集約、UI 側の年表示が連動しているか確認する。
- Browser Mode で落ちる場合は、まず `vite.config.ts` の `test.browser` 設定と Playwright のブラウザ導入状況を確認する。

## 型チェックと lint

- 型チェック: `vp run typecheck`
- Lint: `vp lint .`
- Format: `vp fmt .`
- Format 確認: `vp fmt . --check`

型エラーを隠すための型削除や過度な型アサーションは避け、原因を直してください。

## 典型タスクの手順

### スピーカー検索/フィルタを調整

- `SpeakerFilterBar.vue`、`YearFilterBar.vue`、`DirectoryView.vue`、`ChronicleView.vue` を確認する。
- 取得・絞り込みロジックが必要なら `app/composables/speaker.ts` を更新する。
- スピーカー集約や日本語判定に関わる場合は `app/utils/speakerMap.ts`、`app/utils/stringCollate.ts` も確認する。
- 影響範囲のテストを更新する。

### コンポーネントを追加

- `app/components/` に追加し、該当ページや island で利用する。
- 既存の CSS カスタムプロパティと Tailwind ユーティリティに合わせる。
- グローバルな見た目やフォーカススタイルは `app/assets/css/main.css` を確認する。
- UI の振る舞いは小さな単位でテストする。

### 表示文言や言語切替を変更

- 文言は `app/composables/useVfjsI18n.ts` の `translations` を更新する。
- `ja` と `en` の両方を揃える。
- スピーカー名の英語表記はデータ側の `nameEn` を確認する。

## CI

GitHub Actions は Vite+ セットアップ後に以下を実行します。

- `vp lint .`
- `vp fmt . --check`
- `vp run typecheck`
- `vp test run`

Browser Mode の test job では、テスト前に `vp exec playwright install --with-deps chromium` で Chromium を導入します。CI の対象 path は `app/**`、`server/**`、`types/**`、各種設定ファイル、lockfile などです。ドキュメントのみの変更では一部の workflow が走らない場合があります。

## デプロイ

`vp build` で `dist/client` に静的ファイルを生成します。生成後の確認には `vp preview --outDir dist/client` を使います。

## 開発フロー（推奨）

- ブランチ: `feat/*`、`fix/*`、`chore/*`、`docs/*` など用途別に作成する。
- コミット: Conventional Commits を使う。例: `docs: update agents guide`
- 実装: 小さめの差分で進め、関連テストやドキュメントも合わせて更新する。
- 検証: 変更内容に応じて `vp lint . && vp fmt . --check && vp run typecheck && vp test run` を実行する。
- レビュー: 変更点の要約、確認したコマンド、必要に応じてスクリーンショットや再現手順を添える。

## トラブルシュート

- 依存関係の不整合: `vp install` を実行し、必要なら `vp config` も実行する。
- パッケージマネージャーの確認: `package.json` の `packageManager` を確認する。
- 型エラー: `vp run typecheck` で原因を洗い出し、型定義・import・データ構造を直す。
- Vite+ 設定の不整合: `vp config` を再実行する。
- Browser Mode のブラウザ不足: `vp exec playwright install chromium` を実行する。Linux CI では `--with-deps` も付ける。
- キャッシュ問題: Vite や生成物のキャッシュが怪しい場合は開発サーバを再起動する。
