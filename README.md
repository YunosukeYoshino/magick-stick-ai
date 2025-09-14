# キャラクター設定 AIアシスタント


## 概要

キャラクター設定 AIアシスタントは、Google Gemini AIを活用した革新的なキャラクター作成ツールです。画像をアップロードするだけで、AIが自動的にキャラクターの特徴を分析し、設定資料の生成や新しいポーズの作成を支援します。

## ✨ 主な機能

- **🎨 画像アップロード**: キャラクター画像を簡単にアップロード
- **🤖 AI分析**: Google Gemini AIによる自動的なキャラクター特徴抽出
- **📝 YAML生成**: 画像生成用のYAMLプロンプトを自動生成
- **👤 キャラクターシート**: 全身立ち絵（正面・背面・側面）の自動生成
- **🎭 ポーズ生成**: 新しいポーズや表情の生成
- **🔄 リアルタイム処理**: 高速なAI処理とレスポンシブUI

## 🛠️ 技術スタック

### フロントエンド
- **React 19** - 最新のReact機能を活用
- **TanStack Router** - 型安全なルーティング
- **TypeScript** - 完全な型安全性
- **Vite** - 高速な開発環境とビルド
- **Tailwind CSS** - モダンなスタイリング

### AI・バックエンド
- **Google Gemini AI** - 高度な画像分析と生成
- **@google/genai** - Gemini API統合

### 開発ツール
- **Biome** - 高速なリンターとフォーマッター
- **ESLint** - コード品質管理

## 🚀 クイックスタート

### 前提条件
- Node.js 18.0.0 以上
- Google Gemini API キー

### セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd character-sheet-ai-assistant
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   ```bash
   cp .env.sample .env.local
   ```

   `.env.local`ファイルにGemini APIキーを設定：
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   ```
   http://localhost:5173
   ```

## 📚 ドキュメント

### TanStack Router
- **公式ドキュメント**: [https://tanstack.com/router/latest](https://tanstack.com/router/latest)
- **GitHub**: [https://github.com/tanstack/router](https://github.com/tanstack/router)
- **型安全性ガイド**: [https://tanstack.com/router/latest/docs/framework/react/guide/type-safety](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety)

### Google Gemini AI
- **公式ドキュメント**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **API リファレンス**: [https://ai.google.dev/api/rest](https://ai.google.dev/api/rest)

### その他の技術
- **React 19**: [https://react.dev](https://react.dev)
- **Vite**: [https://vitejs.dev](https://vitejs.dev)
- **TypeScript**: [https://www.typescriptlang.org](https://www.typescriptlang.org)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

## 🏗️ プロジェクト構造

```
character-sheet-ai-assistant/
├── components/           # Reactコンポーネント
│   ├── CharacterSheetGenerator.tsx
│   ├── ImageUploader.tsx
│   ├── Loader.tsx
│   └── Navigation.tsx
├── routes/              # TanStack Routerルート
│   ├── __root.tsx       # ルートレイアウト
│   ├── index.tsx        # ホームページ
│   └── about.tsx        # アバウトページ
├── services/            # APIサービス
│   └── geminiService.ts
├── types/               # TypeScript型定義
│   ├── app.ts
│   ├── env.d.ts
│   └── router.d.ts
├── router.tsx           # ルーター設定
├── routeTree.gen.ts     # 自動生成ルートツリー
└── vite.config.ts       # Vite設定
```

## 🎯 使用方法

1. **画像アップロード**: キャラクター画像をドラッグ&ドロップまたはクリックでアップロード
2. **YAML生成**: 「YAMLプロンプトを生成」ボタンをクリックしてAI分析を開始
3. **キャラクターシート作成**: 生成されたYAMLを基に全身立ち絵を作成
4. **新しいポーズ生成**: テキスト指示や参考画像を使用して新しいポーズを生成

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview

# リンター実行
npm run lint

# リンター修正
npm run lint:fix

# フォーマッター実行
npm run format

# フォーマッター修正
npm run format:fix

# 型チェック
npm run typecheck
```

## 🌟 特徴

### 型安全性
- **完全なTypeScript対応**: エンドツーエンドの型安全性
- **TanStack Router**: 型安全なルーティングとナビゲーション
- **厳密な型チェック**: 開発時のエラーを最小化

### パフォーマンス
- **Vite**: 高速な開発サーバーとビルド
- **コード分割**: 自動的なコード分割と遅延読み込み
- **最適化**: プロダクション用の最適化されたバンドル

### 開発体験
- **ホットリロード**: リアルタイムでの変更反映
- **エラーハンドリング**: 包括的なエラー処理とユーザーフィードバック
- **レスポンシブデザイン**: モバイルファーストのUI/UX

