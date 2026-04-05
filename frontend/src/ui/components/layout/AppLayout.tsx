import AppSidebar from "../AppSidebar";
import { SidebarProvider } from "../shadcn/sidebar";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <Outlet />
    </SidebarProvider>
  );
}
