import { Link, useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./shadcn/sidebar";
import { CloudBackup, LogOut, Settings, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { url: "patients", label: "Patients", icon: User },
  { url: "backup", label: "Backup", icon: CloudBackup },
  { url: "settings", label: "Settings", icon: Settings },
];

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currTab = location.pathname.split("/").slice(1)[0];

  return (
    <Sidebar className="border-r border-border/80 bg-sidebar">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
                  <Stethoscope className="size-5" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    ClinicSync
                  </h2>
                  <span className="text-[10px] font-medium text-muted-foreground">Clinical Management</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {modules.map((module, i) => {
                const isActive = currTab === module.url;
                return (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 w-full rounded-xl px-3 transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <Link to={`/${module.url}`} className="flex items-center gap-3">
                        <module.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-xs">{module.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/60">
        <SidebarMenuItem className="list-none space-y-1">
          <SidebarMenuButton
            className="w-full justify-start rounded-xl px-3 py-2.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="size-4" />
              <span className="font-medium">Logout</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
