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
import { ChevronRight, GitGraph, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";

const modules = [
  { url: "", label: "Dashboard", icon: GitGraph },
  { url: "patients", label: "Patients", icon: User },
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
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 p-6">
                <div>
                  <h2 className="text-xl leading-tight font-semibold text-slate-900">
                    ClinicSync
                  </h2>
                </div>
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
                      `flex w-full items-center gap-3 rounded-lg px-3 py-6 text-sm font-medium transition-all`,
                      (module.label === "Dashboard" &&
                        location.pathname === "/") ||
                        (module.url === currTab && module.label !== "Dashboard")
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Link to={`/${module.url}`}>
                      <module.icon
                        size={18}
                        className={
                          (module.label === "Dashboard" &&
                            location.pathname === "/") ||
                          (module.url === currTab &&
                            module.label !== "Dashboard")
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />
                      {module.label}
                      {(module.label === "Dashboard" &&
                        location.pathname === "/") ||
                        (module.url === currTab &&
                          module.label !== "Dashboard" && (
                            <div className="ml-auto">
                              <ChevronRight size={14} />
                            </div>
                          ))}
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
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="bg-neutral-200">JD</AvatarFallback>
              </Avatar>
              <span className="font-semibold">John Doe</span>
            </div>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="w-full cursor-pointer justify-start px-3 py-6 text-slate-600 hover:text-red-700"
            onClick={() => navigate("/")}
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
