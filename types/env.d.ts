/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GEMINI_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  // 他の環境変数をここに追加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
