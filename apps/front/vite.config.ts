import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig(() => {
	return {
		plugins: [
			// tanstackRouter({
			// 	target: "react",
			// 	routesDirectory: "./src/routes",
			// 	generatedRouteTree: "./src/routeTree.gen.ts",
			// 	autoCodeSplitting: true,
			// 	routeFileIgnorePrefix: "-",
			// 	routeFileIgnorePattern: "\\..*",
			// 	disableDiscovery: true,
			// }),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
