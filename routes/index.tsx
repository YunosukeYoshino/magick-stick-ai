import { createFileRoute } from "@tanstack/react-router";
import { CharacterSheetGenerator } from "@/components/CharacterSheetGenerator";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            キャラクター設定 AIアシスタント
          </h1>
          <p className="text-lg text-gray-400">
            キャラクター画像をアップロードして、設定資料の作成や新しいポーズの生成をしよう
          </p>
        </header>
        <main>
          <CharacterSheetGenerator />
        </main>
      </div>
    </div>
  );
}
