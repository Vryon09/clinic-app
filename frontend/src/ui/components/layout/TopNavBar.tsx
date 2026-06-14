import { cn } from "@/lib/utils";
import { LogOut, Moon, Settings, Sun, User2 } from "lucide-react";
import { Button } from "../shadcn/button";
import { useLocation, useNavigate } from "react-router";

import { useLogout } from "@/services/apiAuth";
import { Separator } from "../shadcn/separator";
import { Toggle } from "../shadcn/toggle";
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
    <div className="flex items-center justify-between px-4 py-3 print:hidden">
      <p className="text-sm font-semibold">ClinicSync</p>

      <div className="flex h-8 items-center gap-1">
        {modules.map((module) => (
          <Button
            key={module.url}
            className={cn(
              "cursor-pointer rounded-lg border-neutral-300 px-3 py-1 text-xs",
            )}
            size={currTab === module.url ? "sm" : "icon-sm"}
            variant={currTab === module.url ? "default" : "outline"}
            onClick={() => navigate(`/${module.url}`)}
          >
            <module.icon /> {currTab === module.url && module.label}
          </Button>
        ))}

        <Separator orientation="vertical" className="mx-2" />

        <Toggle
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-full w-8 cursor-pointer rounded-full p-0"
        >
          {theme === "light" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Toggle>

        <Separator orientation="vertical" className="mx-2" />

        <Button
          className={cn(
            "cursor-pointer rounded-lg border-neutral-300 px-3 py-1 text-xs hover:border-0 hover:bg-red-600 hover:text-white",
          )}
          size={"icon-sm"}
          variant={"outline"}
          onClick={() => {
            handleLogout();
          }}
        >
          <LogOut />
        </Button>
      </div>
    </div>
  );
}

export default TopNavBar;
