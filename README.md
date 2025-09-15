# Character Sheet AI Assistant

キャラクターシート生成AIアシスタントプロジェクト

## プロジェクト構造

```
character-sheet-ai-assistant/
├── apps/
│   ├── front/      # フロントエンド (React + TanStack Router + Vite)
│   └── backend/    # バックエンド (Cloudflare Hono)
└── package.json    # ルートパッケージ管理 (Bun Workspaces)
```

## セットアップ

### 依存関係のインストール

```bash
# ルートディレクトリで（すべてのワークスペースの依存関係を一括インストール）
bun install
```

Bunのworkspaces機能により、`apps/front`と`apps/backend`の依存関係が自動的に管理されます。

### 環境変数の設定

#### バックエンド（Cloudflare Workers）

**開発環境用**
```bash
cd apps/backend
# .dev.varsファイルにAPIキーを設定
echo "GEMINI_API_KEY=your_actual_api_key_here" > .dev.vars
```

**本番環境用**
```bash
cd apps/backend
# Gemini APIキーを設定
wrangler secret put GEMINI_API_KEY
```

#### フロントエンド
```bash
cd apps/front
# .env.localファイルを作成
echo "VITE_API_BASE_URL=http://localhost:8787" > .env.local
```

## 開発

### フロントエンドとバックエンドを同時に起動

```bash
bun run dev
```

### 個別に起動

```bash
# フロントエンドのみ
bun run dev:front

# バックエンドのみ
bun run dev:back
```

### ワークスペース内で直接実行

```bash
# フロントエンドディレクトリで直接実行
cd apps/front && bun run dev

# バックエンドディレクトリで直接実行
cd apps/backend && bun run dev
```

## ビルド

```bash
# 両方をビルド
bun run build

# 個別にビルド
bun run build:front
bun run build:back
```

## デプロイ

```bash
# バックエンドをCloudflare Workersにデプロイ
bun run deploy
```

## Bun Workspacesの利点

- **依存関係の統一管理**: ルートで`bun install`するだけで全ワークスペースの依存関係がインストール
- **効率的なキャッシュ**: 共通の依存関係は共有され、ディスク容量を節約
- **一貫したバージョン管理**: 同じパッケージのバージョンを統一
- **簡単なスクリプト実行**: ルートから各ワークスペースのコマンドを実行可能

## 技術スタック

### フロントエンド
- React 19
- TanStack Router
- Vite
- TypeScript
- Biome (Linting & Formatting)

### バックエンド
- Cloudflare Hono
- TypeScript
- Wrangler (Cloudflare Workers CLI)
