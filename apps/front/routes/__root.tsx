import { Navigation } from "@/components/Navigation";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
			<Navigation />
			<Outlet />
		</div>
	),
});
