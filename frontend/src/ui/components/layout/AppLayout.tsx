import { Outlet, useLocation } from "react-router";
import TopNavBar from "./TopNavBar";
import AppSidebar from "../AppSidebar";
import { SidebarProvider, SidebarInset } from "../shadcn/sidebar";

export function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes("auth");

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <TopNavBar />
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
