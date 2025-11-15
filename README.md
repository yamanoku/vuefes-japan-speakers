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

## Development Server

```bash
pnpm dev
```

## Production

```bash
pnpm build
```

## Deploy

```bash
npx nuxthub deploy
```

## MCP Server

このプロジェクトは、AIアシスタント向けの**MCP (Model Context Protocol) サーバー**を提供しています。

### 利用可能なリソース

- `speakers://all` - 全年度のスピーカー一覧
- `speakers://statistics` - スピーカーの統計情報

### 利用可能なツール

- `list_speakers` - 全スピーカーの一覧取得
- `get_speakers_by_year` - 年度別スピーカー取得（2018, 2019, 2022, 2023, 2024, 2025）
- `search_speakers` - スピーカー名での検索
- `get_statistics` - 統計情報の取得（総登壇者数、リピート登壇者など）
- `get_years` - 開催年度一覧

### セットアップ方法

#### Claude Code

```bash
claude mcp add --transport http vuefes-speakers https://your-domain.com/mcp
```

#### Cursor

`.cursor/mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "vuefes-speakers": {
      "type": "http",
      "url": "https://your-domain.com/mcp"
    }
  }
}
```

#### VS Code

`.vscode/mcp.json` に同様の設定を追加してください。

### 使用例

AIアシスタントに以下のような質問ができます：

- "Vue Fes Japan 2024のスピーカーを教えて"
- "複数回登壇しているスピーカーは誰？"
- "Evan Youが登壇した年度を教えて"
- "Vue Fes Japanの統計情報を見せて"

## License

[CC BY-SA 4.0](./LICENSE)
