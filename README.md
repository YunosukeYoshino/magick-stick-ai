# まじっくすてっき

![magick-stick-ai](https://github.com/user-attachments/assets/6d084402-7fe5-429d-95c2-622f55d2ae4b)

## 📖 概要

**まじっくすてっき** は、Google Geminiの最新モデル **Gemini 2.5 Flash Image Preview**（`gemini-2.5-flash-image-preview`）を活用したキャラクター生成・管理アプリケーションです。

画像をアップロードするだけでAIがキャラクターの特徴を解析し、設定資料や新しいポーズ・表情の生成を支援します。デザイナー、イラストレーター、ゲーム開発者に最適なオールインワンツールです。

---

## ✨ 主な機能

- **🎨 画像アップロード**: キャラクター画像をドラッグ&ドロップで簡単に追加
- **🤖 AI解析 (Gemini 2.5 Flash Image Preview)**: キャラクターの特徴を自動抽出し、タグ・属性・設定資料を生成
- **📝 YAMLプロンプト生成**: 画像生成用プロンプトをワンクリックで生成
- **👤 キャラクターシート作成**: 正面・背面・側面の全身立ち絵を自動作成
- **🎭 ポーズ・表情生成**: テキスト指示や参考画像をもとに新規ポーズや表情を生成
- **🔄 リアルタイム処理**: 高速なAI推論とレスポンシブなUI

---

## 🛠️ 技術スタック

### フロントエンド
- **React 19** – 最新React APIによるモダンなUI
- **TanStack Router** – 型安全なルーティング
- **TypeScript** – 完全型安全な開発環境
- **Vite** – 超高速な開発ビルド環境
- **Tailwind CSS + shadcn/ui** – 美しく拡張性のあるデザイン

### AI・バックエンド
- **Gemini 2.5 Flash Image Preview**（`gemini-2.5-flash-image-preview`） – キャラクター特徴抽出・ポーズ生成エンジン
- **@google/genai** – Gemini API統合

### 開発ツール
- **Biome** – 高速リンター・フォーマッター
- **ESLint** – コード品質管理

---

## 🚀 クイックスタート（Bun版）

### 前提条件
- Bun 1.1.0 以上
- Google Gemini API キー

### セットアップ

```bash
# Bunのインストール（未導入の場合）
curl -fsSL https://bun.sh/install | bash

# リポジトリをクローン
git clone <repository-url>
cd magick-stick-ai

# 依存関係のインストール（npmではなくbun）
bun install

# 環境変数の設定
cp .env.sample .env.local
```

`.env.local` に APIキーを設定：

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-image-preview
```

```bash
# 開発サーバーの起動（bun run）
bun run dev
```

ブラウザで `http://localhost:5173` にアクセス。

---

## 📚 参考ドキュメント

- **Gemini 2.5 Flash Image Preview**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **TanStack Router**: [https://tanstack.com/router/latest](https://tanstack.com/router/latest)
- **React 19**: [https://react.dev](https://react.dev)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **Bun**: [https://bun.sh](https://bun.sh)

---

## 🏗️ プロジェクト構造

```
magick-stick-ai/
├── components/           # UIコンポーネント
│   ├── CharacterSheetGenerator.tsx
│   ├── ImageUploader.tsx
│   ├── Loader.tsx
│   └── Navigation.tsx
├── routes/               # TanStack Routerルート
│   ├── __root.tsx
│   ├── index.tsx
│   └── about.tsx
├── services/             # APIサービス
│   ├── geminiService.ts  # Gemini 2.5 Flash Image Preview連携
├── types/                # 型定義
│   ├── app.ts
│   ├── env.d.ts
│   └── router.d.ts
├── router.tsx            # ルーター設定
├── routeTree.gen.ts      # 自動生成ルートツリー
└── vite.config.ts        # Vite設定
```

---

## 🎯 使用方法

1. **画像アップロード**: 画像をドラッグ&ドロップまたはクリックでアップロード
2. **YAMLプロンプト生成**: 「YAMLプロンプト生成」ボタンをクリックしてAI解析を実行
3. **キャラクターシート作成**: 生成されたプロンプトをもとに全身立ち絵を自動生成
4. **ポーズ・表情生成**: テキスト指示または参考画像で新しいポーズ・表情を作成

---

## 🔧 開発コマンド（Bun版）

```bash
# 開発サーバー起動
bun run dev

# プロダクションビルド
bun run build

# ビルドプレビュー
bun run preview

# リンター実行
bun run lint

# リンター修正
bun run lint:fix

# フォーマッター実行
bun run format

# フォーマッター修正
bun run format:fix

# 型チェック
bun run typecheck
```

---

## 🌟 特徴

### 型安全性
- **完全TypeScript対応**でエンドツーエンド型安全
- **TanStack Router**による型安全なナビゲーション
- **厳密な型チェック**で開発時エラーを最小化

### パフォーマンス
- **Bun + Vite**による超高速な開発・ビルド
- **自動コード分割**と遅延読み込み
- **プロダクション最適化済み**バンドル

### 開発体験
- **ホットリロード**対応
- **包括的なエラーハンドリング**
- **モバイルファースト**のレスポンシブUI

