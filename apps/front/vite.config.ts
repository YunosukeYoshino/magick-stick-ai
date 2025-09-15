import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
	return {
		plugins: [
			tanstackRouter({
				target: "react",
				routesDirectory: "./routes",
				generatedRouteTree: "./routeTree.gen.ts",
				autoCodeSplitting: true,
				experimental: {
					enableCodeSplitting: true,
				},
				routeFileIgnorePrefix: "-",
				routeFileIgnorePattern: "**/.*",
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "."),
			},
		},
	};
});
