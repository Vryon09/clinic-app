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
import { CloudBackup, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";
import { cn } from "@/lib/utils";

const modules = [
  // { url: "", label: "Dashboard", icon: GitGraph },
  { url: "patients", label: "Patients", icon: User },
  { url: "backup", label: "Backup", icon: CloudBackup },
  { url: "settings", label: "Settings", icon: Settings },
];

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currTab = location.pathname.split("/").slice(1)[0];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mt-2 hover:bg-transparent">
              <div className="flex items-center">
                <h2 className="text-xl leading-tight font-semibold text-slate-900">
                  ClinicSync
                </h2>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      currTab === module.url ? "bg-background" : "",
                    )}
                  >
                    <Link to={`/${module.url}`}>
                      <module.icon />

                      <span
                        className={cn(
                          "text-sm",
                          currTab === module.url ? "font-semibold" : "",
                        )}
                      >
                        {module.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton className="cursor-pointer px-3 py-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">John Doe</span>
            </div>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="w-full cursor-pointer justify-start px-3 py-6 text-slate-600 hover:text-red-700"
            onClick={() => navigate("/login")}
          >
            <div className="flex items-center">
              <LogOut size={16} className="mr-2" />
              <span className=""> Logout</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
