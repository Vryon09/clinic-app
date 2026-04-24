import { cn } from "@/lib/utils";
import { ChevronDown, Settings, User2 } from "lucide-react";
import { Button } from "../shadcn/button";
import { useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { useLogout } from "@/services/apiAuth";

const modules = [
  { url: "patients", label: "Patients", icon: User2 },
  { url: "settings", label: "Settings", icon: Settings },
];

function TopNavBar() {
  const navigate = useNavigate();
  const { mutate: handleLogout } = useLogout();
  const location = useLocation();
  const currTab = location.pathname.split("/").slice(1)[0];

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm font-semibold">ClinicSync</p>

      <div className="flex gap-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "cursor-pointer rounded-lg border-neutral-300 px-3 py-1 text-xs",
              )}
              size="icon-sm"
              variant="outline"
            >
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                handleLogout();
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TopNavBar;
