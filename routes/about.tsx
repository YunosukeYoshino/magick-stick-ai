import { Link } from "@tanstack/react-router";

export function AboutComponent() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            このアプリについて
          </h1>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mb-4">機能</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• キャラクター画像のアップロード</li>
              <li>• AIによるキャラクター設定の自動抽出</li>
              <li>• YAMLプロンプトの生成</li>
              <li>• キャラクターシート（立ち絵）の生成</li>
              <li>• 新しいポーズや表情の生成</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
              技術スタック
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• React 19</li>
              <li>• TanStack Router</li>
              <li>• TypeScript</li>
              <li>• Vite</li>
              <li>• Google Gemini AI</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
