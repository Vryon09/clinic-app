import { cn } from "@/lib/utils";
import { LogOut, Moon, Settings, Sun, User2, Stethoscope } from "lucide-react";
import { Button } from "../shadcn/button";
import { useLocation, useNavigate } from "react-router";

import { useLogout } from "@/services/apiAuth";
import { Separator } from "../shadcn/separator";
import { useTheme } from "next-themes";

const modules = [
  { url: "patients", label: "Patients", icon: User2 },
  { url: "settings", label: "Settings", icon: Settings },
];

function TopNavBar() {
  const navigate = useNavigate();
  const { mutate: handleLogout } = useLogout();
  const location = useLocation();
  const currTab = location.pathname.split("/").slice(1)[0];

  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between print:hidden shadow-xs">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/patients")}>
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
          <Stethoscope className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground leading-none">
            ClinicSync
          </span>
          <span className="text-[10px] font-medium text-muted-foreground leading-tight">
            Clinical System
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <nav className="flex items-center gap-1">
          {modules.map((module) => {
            const isActive = currTab === module.url;
            return (
              <Button
                key={module.url}
                className={cn(
                  "h-8 rounded-lg px-3 text-xs font-semibold gap-1.5 transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                onClick={() => navigate(`/${module.url}`)}
              >
                <module.icon className="size-3.5" />
                <span>{module.label}</span>
              </Button>
            );
          })}
        </nav>

        <Separator orientation="vertical" className="mx-1 h-5 bg-border/60" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <Sun className="size-4 text-amber-500" />
          ) : (
            <Moon className="size-4 text-indigo-400" />
          )}
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5 bg-border/60" />

        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          onClick={() => {
            handleLogout();
          }}
          title="Logout"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}

export default TopNavBar;
