# AGENTS Guide (vuefes-japan-speakers)

このドキュメントは、エージェントや貢献者が本リポジトリで効率よく作業するための実務ガイドです。セットアップ、構成、一般的なタスクの手順、テスト/デプロイの流れを簡潔にまとめています。

## プロジェクト概要

- フレームワーク: Nuxt 4（Vue 3）
- 目的: 歴代の Vue Fes Japan スピーカー一覧を表示
- UI/スタイル: Tailwind CSS 4（カスタムコンポーネント中心）
- データ供給: Nuxt サーバルート（`server/api`）から年別データを返却

## 前提・セットアップ

- 推奨: Node.js LTS, pnpm（`packageManager: pnpm@10.33.1`）
- 依存関係のインストール:

```bash
pnpm install
```

## よく使うスクリプト

- 開発サーバ: `pnpm dev`
- ビルド: `pnpm build`
- 静的生成: `pnpm generate`
- プレビュー: `pnpm preview`
- 型チェック: `pnpm vp:check`
- Lint: `pnpm vp:lint`
- フォーマット: `pnpm vp:fmt`
- テスト（全件）: `pnpm vp:test`
- テスト（監視）: `pnpm vp:test:watch`

## ディレクトリ構成（要点）

- `app/`
  - `pages/` ページ
  - `components/` UI コンポーネント
  - `composables/` アプリ用のロジック（`useVfjsI18n`, `useColorScheme`, `speaker` など）
  - `utils/` ユーティリティ関数
  - `assets/css/main.css` グローバル CSS・カラートークン定義
- `server/`
  - `api/` API ルート
  - `data/` 年別スピーカーデータ（`speakers-YYYY.ts` とインデックス）
- `public/` 静的ファイル
- `nuxt.config.ts` Nuxt 設定ファイル
- `eslint.config.mjs`, `vitest.config.ts`, `tsconfig.json` ツール設定

## API とデータ

- 一覧: `server/api/speakers.ts`
- 年別: `server/api/speakers/[year].ts`
- データ源: `server/data/` 配下に `speakers-2018.ts` ～ `speakers-2025.ts` などを配置し、`server/data/index.ts` から集約・エクスポートします。

### 変更に伴う確認ポイント:

- 新しい年を追加したら、API のレスポンスが期待通りかテストで検証（`server/api/speakers/[year].test.ts` など）。
- UI 側で年選択や一覧表示が反映されるか（`app/utils/years.ts`, `YearFilterBar.vue`）を確認。

## UI/ページの要点

- ルーティング:
  - `app/pages/[year]/index.vue` 年別一覧ページ
  - `app/pages/speakers/[name]/index.vue` スピーカー詳細/個別ページ
- コンポーネント:
  - `AppHeader.vue` ナビゲーション・言語切替・カラースキーム切替
  - `AppMasthead.vue` / `AppFooter.vue` ページ共通ヘッダ・フッタ
  - `DirectoryView.vue` 全スピーカー一覧（開示行で年バッジ表示）
  - `ChronicleView.vue` 年別タイムライン表示
  - `SpeakerFilterBar.vue` / `YearFilterBar.vue` フィルタ UI
- スタイル: Tailwind CSS 4 ユーティリティ + CSS カスタムプロパティ（`var(--paper)`, `var(--ink)`, `var(--accent)` 等）

## カラースキーム

`useColorScheme` composable でライト / ダーク / システム の3段階を管理します。

- 状態: `'light' | 'dark' | 'system'`（デフォルト: `'system'`）
- 保存先: `localStorage('vfjs:color-scheme')`
- 適用方法: `:root` の `data-color-scheme` 属性を操作
  - `system` → 属性を削除し `@media (prefers-color-scheme: dark)` に委ねる
  - `light` / `dark` → `data-color-scheme="light/dark"` をセット
- CSS 定義: `app/assets/css/main.css` にトークンを定義（ライト/ダーク両方）
  - `@import 'tailwindcss'`（`theme(static)` は LightningCSS minify エラーを引き起こすため除去済み）

## テスト

- ランナー: Vitest（DOM: happy-dom）
- 位置: `app/**.test.ts`, `server/**.test.ts`
- 実行: `pnpm vp:test:watch`

## 型チェック

- ランナー: vite-plus（`vp check`）
- 実行: `pnpm vp:check`
- 目的: 型の整合性を保ち、潜在的なバグを防止

### 書き方の指針:

- ユニットテストは入出力と副作用の最小検証に集中。
- ルート/API は境界値・異常系（存在しない年など）もカバー。

## 典型タスクの手順

### 1. 新しい開催年のスピーカーデータを追加

- `server/data/speakers-YYYY.ts` を作成し型に沿ってデータを定義。
- `server/data/index.ts` にインポートとエクスポートを追加。
- 必要に応じて `app/utils/years.ts` に年を追加（表示順の維持に注意）。
- API テストを追加/更新（`server/api/speakers/[year].test.ts`）。
- UI 表示を確認（`/[year]` ページ、年セレクタ）。

### 2. スピーカー検索/フィルタを調整

- `SpeakerFilterBar.vue` や `DirectoryView.vue` を変更。
- 変更に合わせ `composables/speaker.ts` で取得ロジックやフィルタを調整。
- 影響範囲のテスト更新（該当ページ/コンポーネントの test）。

### 3. コンポーネントを追加

- `app/components/` に追加し、該当ページで読み込み。
- スタイルは Tailwind ユーティリティを優先。
- UI の振る舞いは小さな単位でテスト。

## 開発フロー（推奨）

- ブランチ: `feat/*`, `fix/*`, `chore/*` など用途別に作成。
- 実装: 小さなコミットで進め、関連テストを同時に更新。
- 検証: `pnpm vp:lint && pnpm vp:check && pnpm vp:test` で事前チェック。
  - 型チェックは特に重要。型を消すなどしてエラーを隠さないこと。その場合は詰めます。
- レビュー: 変更点の要約、スクリーンショットや再現手順があると親切。

## トラブルシュート

- Node/pnpm の不整合: ローカルの pnpm を `pnpm -v` で確認（推奨 10 系）。
- 型エラー: `pnpm vp:check` で事前に洗い出し。
  - 再三忠告しますが、型を消すなどしてエラーを隠さないこと。その場合は詰めます。
- キャッシュ問題: Nuxt のキャッシュが怪しい場合は開発サーバ再起動で解消することがあります。
