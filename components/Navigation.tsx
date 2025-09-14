import { Link, useLocation } from "@tanstack/react-router";
import { ResetIcon } from "./Icons";

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 transition-all"
            >
              キャラクター設定 AI
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-white bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                ホーム
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/about"
                    ? "text-white bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                このアプリについて
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                localStorage.removeItem("characterSheetGeneratorData");
                window.location.reload();
              }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600 px-3 py-2 rounded-lg transition-colors"
              title="データをリセット"
            >
              <ResetIcon />
              <span className="hidden sm:inline">リセット</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
