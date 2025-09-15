# Character Sheet AI Assistant - Agent Documentation

## プロジェクト概要

キャラクターシート生成AIアシスタントは、画像からキャラクターの詳細な分析を行い、一貫したキャラクターシートを生成するWebアプリケーションです。Google Gemini APIを使用して、画像認識と画像生成の両方の機能を提供します。

## アーキテクチャ

### フロントエンド (`apps/front`)
- **フレームワーク**: React 19 + TanStack Router + Vite
- **言語**: TypeScript
- **スタイリング**: CSS Modules / Tailwind CSS（将来実装予定）
- **状態管理**: React Hooks
- **ビルドツール**: Vite
- **リンター**: Biome

### バックエンド (`apps/backend`)
- **フレームワーク**: Cloudflare Hono
- **言語**: TypeScript
- **デプロイ先**: Cloudflare Workers
- **API**: RESTful API
- **AI**: Google Gemini API

## 主要機能

### 1. YAMLプロンプト生成
- 画像をアップロードしてキャラクターの詳細分析を生成
- エンドポイント: `POST /api/generate-yaml`
- 入力: 画像ファイル + プロンプト
- 出力: YAML形式のキャラクター分析

### 2. キャラクターシート生成
- 分析結果から一貫したキャラクターシートを生成
- エンドポイント: `POST /api/generate-character-sheet`
- 入力: 画像ファイル + YAMLプロンプト
- 出力: キャラクターシート画像（正面・背面・側面）

### 3. 新しい画像生成
- キャラクターシートを参考に新しい画像を生成
- エンドポイント: `POST /api/generate-new-image`
- 入力: キャラクターシート + プロンプト + ポーズ参考画像（オプション）
- 出力: 生成された画像

## 開発環境セットアップ

### 前提条件
- Bun 1.1.0以上
- Node.js 18以上（Bunのフォールバック用）

### 初期セットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd character-sheet-ai-assistant

# 依存関係のインストール
bun install

# 環境変数の設定
cd apps/backend
# 開発環境用
echo "GEMINI_API_KEY=your_actual_api_key_here" > .dev.vars
# 本番環境用
wrangler secret put GEMINI_API_KEY

cd ../front
echo "VITE_API_BASE_URL=http://localhost:8787" > .env.local
```

### 開発サーバーの起動

```bash
# フロントエンドとバックエンドを同時起動
bun run dev

# 個別起動
bun run dev:front  # フロントエンドのみ
bun run dev:back   # バックエンドのみ
```

## プロジェクト構造

```
character-sheet-ai-assistant/
├── apps/
│   ├── front/                 # フロントエンドアプリケーション
│   │   ├── components/        # Reactコンポーネント
│   │   │   ├── CharacterSheetGenerator.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── routes/           # TanStack Routerルート
│   │   ├── services/         # API呼び出しサービス
│   │   ├── types/            # TypeScript型定義
│   │   └── package.json
│   └── backend/              # バックエンドAPI
│       ├── src/
│       │   ├── index.ts      # メインAPIサーバー
│       │   └── services/     # ビジネスロジック
│       │       └── geminiService.ts
│       ├── wrangler.toml     # Cloudflare Workers設定
│       └── package.json
├── package.json              # ルートパッケージ管理
└── README.md
```

## API仕様

### エンドポイント一覧

#### `POST /api/generate-yaml`
YAMLプロンプトを生成します。

**リクエスト**
- Content-Type: `multipart/form-data`
- Body:
  - `image`: File - 分析対象の画像
  - `prompt`: string - 分析指示

**レスポンス**
```json
{
  "yamlPrompt": "string"
}
```

#### `POST /api/generate-character-sheet`
キャラクターシートを生成します。

**リクエスト**
- Content-Type: `multipart/form-data`
- Body:
  - `image`: File - 元画像
  - `yamlPrompt`: string - キャラクター分析YAML

**レスポンス**
```json
{
  "characterSheet": "data:image/jpeg;base64,..."
}
```

#### `POST /api/generate-new-image`
新しい画像を生成します。

**リクエスト**
- Content-Type: `multipart/form-data`
- Body:
  - `characterSheet`: File - キャラクターシート画像
  - `prompt`: string - 生成指示
  - `compositionImage`: File (optional) - ポーズ参考画像

**レスポンス**
```json
{
  "image": "data:image/jpeg;base64,...",
  "text": "string"
}
```

## 環境変数

### バックエンド
- `GEMINI_API_KEY`: Google Gemini APIキー（必須）
  - 開発環境: `.dev.vars`ファイルに設定
  - 本番環境: `wrangler secret put GEMINI_API_KEY`で設定

### フロントエンド
- `VITE_API_BASE_URL`: バックエンドAPIのベースURL（デフォルト: http://localhost:8787）

## デプロイ

### バックエンド（Cloudflare Workers）
```bash
cd apps/backend
bun run deploy
```

### フロントエンド（静的ホスティング）
```bash
cd apps/front
bun run build
# dist/ディレクトリを静的ホスティングサービスにデプロイ
```

## 開発ガイドライン

### コードスタイル
- TypeScriptのstrict modeを使用
- Biomeでコードフォーマットとリンティングを実行
- 関数とコンポーネントには適切な型注釈を追加

### コミット規約
```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更
refactor: リファクタリング
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `fix/*`: バグ修正

## トラブルシューティング

### よくある問題

#### 1. CORS エラー
- バックエンドのCORS設定を確認
- フロントエンドのURLが許可されているか確認

#### 2. Gemini API エラー
- APIキーが正しく設定されているか確認
- APIの使用制限に達していないか確認

#### 3. 画像アップロードエラー
- ファイルサイズ制限を確認
- サポートされている画像形式か確認

### ログの確認
```bash
# バックエンドのログ
cd apps/backend
wrangler tail

# フロントエンドの開発者ツール
# ブラウザの開発者ツールでコンソールを確認
```

## パフォーマンス最適化

### フロントエンド
- 画像の圧縮とリサイズ
- 遅延読み込み（Lazy Loading）
- メモ化（React.memo, useMemo）

### バックエンド
- レスポンスキャッシュ
- 画像処理の最適化
- エラーハンドリングの改善

## セキュリティ

### API セキュリティ
- CORS設定の適切な管理
- レート制限の実装（将来実装予定）
- 入力値の検証

### データ保護
- APIキーの安全な管理
- ユーザーアップロード画像の一時的な保存
- 個人情報の適切な処理

## 今後の拡張予定

### 機能拡張
- ユーザー認証システム
- キャラクターシートの保存・管理
- 複数キャラクターの管理
- キャラクターシートの共有機能

### 技術的改善
- データベースの導入
- リアルタイム通信（WebSocket）
- プログレッシブWebアプリ（PWA）
- モバイルアプリ対応

## 貢献方法

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 連絡先

プロジェクトに関する質問や提案がある場合は、GitHubのIssuesまたはプルリクエストでお知らせください。
