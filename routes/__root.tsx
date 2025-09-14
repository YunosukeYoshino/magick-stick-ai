import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navigation } from "@/components/Navigation";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Navigation />
      <Outlet />
    </div>
  );
}
