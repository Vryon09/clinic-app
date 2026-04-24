import { Outlet, useLocation } from "react-router";
import TopNavBar from "./TopNavBar";
import { Separator } from "../shadcn/separator";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full flex-col px-8">
      {!location.pathname.includes("auth") && (
        <>
          <TopNavBar />

          <Separator className="mb-4" />
        </>
      )}

      <Outlet />
    </div>
  );
}
