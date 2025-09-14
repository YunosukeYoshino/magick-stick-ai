import path from "path";
import { defineConfig, loadEnv } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [
      tanstackRouter({
        target: "react",
        routesDirectory: "./routes",
        generatedRouteTree: "./routeTree.gen.ts",
        autoCodeSplitting: true,
      }),
    ],
    define: {
      "process.env.API_KEY": JSON.stringify(env["GEMINI_API_KEY"]),
      "process.env.GEMINI_API_KEY": JSON.stringify(env["GEMINI_API_KEY"]),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
