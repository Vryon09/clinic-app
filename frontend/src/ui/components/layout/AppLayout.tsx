import { Outlet } from "react-router";
import TopNavBar from "./TopNavBar";
import { Separator } from "../shadcn/separator";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col px-8">
      <TopNavBar />

      <Separator className="mb-4" />

      <Outlet />
    </div>
  );
}
