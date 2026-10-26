import { Link, useLocation } from "react-router";
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
  SidebarRail,
  useSidebar,
} from "./shadcn/sidebar";
import { LogOut, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLogo } from "./common/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/services/apiAuth";

const modules = [
  { url: "patients", label: "Patients", icon: Users },
  { url: "settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currTab = location.pathname.split("/").slice(1)[0];
  const { user } = useAuth();
  const { mutate: handleLogout } = useLogout();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (first?: string, last?: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase() || "CS";
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "Clinic Manager";
      case "DOCTOR":
        return "Attending Physician";
      case "ASSISTANT":
        return "Clinical Assistant";
      default:
        return "Staff Member";
    }
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username
    : "Staff Member";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar transition-all duration-200">
      {/* Brand Header */}
      <SidebarHeader className={cn("border-b border-border/50", isCollapsed ? "p-2.5 flex items-center justify-center" : "p-4")}>
        {isCollapsed ? (
          <Link
            to="/patients"
            title="ClinicSync"
            className="flex size-9 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors"
          >
            <AppLogo variant="icon" className="size-8" />
          </Link>
        ) : (
          <Link
            to="/patients"
            className="flex items-center gap-3 p-0 hover:opacity-90 transition-opacity"
            title="ClinicSync"
          >
            <AppLogo variant="icon" className="size-8 shrink-0" />
            <div className="flex flex-col min-w-0">
              <h2 className="text-base font-bold tracking-tight text-foreground leading-none truncate">
                ClinicSync
              </h2>
              <span className="text-[10px] font-medium text-muted-foreground mt-1 leading-none truncate">
                Clinical System
              </span>
            </div>
          </Link>
        )}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className={cn("py-4", isCollapsed ? "px-1.5" : "px-3")}>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {!isCollapsed && (
              <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase transition-opacity duration-200">
                Management
              </div>
            )}
            <SidebarMenu className={cn("space-y-1.5", isCollapsed && "items-center")}>
              {modules.map((module) => {
                const isActive = currTab === module.url;
                return (
                  <SidebarMenuItem
                    key={module.url}
                    className={cn(isCollapsed && "flex justify-center w-full")}
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={module.label}
                      className={cn(
                        "rounded-xl transition-all duration-150 cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/95 hover:text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        isCollapsed
                          ? "size-9 p-0 mx-auto flex items-center justify-center"
                          : "h-10 w-full px-3"
                      )}
                    >
                      <Link
                        to={`/${module.url}`}
                        className={cn(
                          "flex items-center",
                          isCollapsed ? "size-full justify-center" : "gap-3"
                        )}
                      >
                        <module.icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="text-xs truncate">{module.label}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Profile Card */}
      <SidebarFooter className={cn("border-t border-border/60", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-1">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-2xs"
              title={`${fullName} (${getRoleLabel(user?.role)})`}
            >
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            <button
              onClick={() => handleLogout()}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              title="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-2xs">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-foreground leading-tight">
                  {fullName}
                </span>
                <span className="truncate text-[10px] text-muted-foreground leading-tight">
                  {getRoleLabel(user?.role)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleLogout()}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              title="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>

      {/* Hover rail for quick retract/expand */}
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
