import AppSidebar from "../AppSidebar";
import { SidebarProvider } from "../shadcn/sidebar";
import { Outlet } from "react-router";
import ContentLayout from "./ContentLayout";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <ContentLayout>
        <Outlet />
      </ContentLayout>
    </SidebarProvider>
  );
}
