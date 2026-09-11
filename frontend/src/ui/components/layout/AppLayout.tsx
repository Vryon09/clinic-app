import { Outlet, useLocation } from "react-router";
import TopNavBar from "./TopNavBar";

export function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes("auth");

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {!isAuthPage && <TopNavBar />}
      <div className="flex-1 flex flex-col w-full py-4 px-6">
        <Outlet />
      </div>
    </div>
  );
}
