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
import { ChevronRight, LogOut, PillBottle, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";

const modules = [{ url: "", label: "Patients", icon: PillBottle }];

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h2 className="leading-tight font-bold text-slate-900">
                    ClinicSync
                  </h2>
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Management
                  </p>
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
                      location.pathname === `/${module.url}`
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Link to={`/${module.url}`}>
                      <module.icon
                        size={18}
                        className={
                          location.pathname === `/${module.url}`
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />
                      {module.label}
                      {location.pathname === `/${module.url}` && (
                        <div className="ml-auto">
                          <ChevronRight size={14} />
                        </div>
                      )}
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
