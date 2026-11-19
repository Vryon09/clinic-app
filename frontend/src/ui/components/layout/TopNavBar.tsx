import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "../shadcn/button";
import { useLocation, useNavigate } from "react-router";
import { Separator } from "../shadcn/separator";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import { SidebarTrigger } from "../shadcn/sidebar";
import { getPatientReturnContext } from "@/lib/patientNavigation";

export function TopNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const isSettingsPage = location.pathname.startsWith("/settings");
  const returnContext = isSettingsPage
    ? (location.state?.returnUrl
        ? {
            returnUrl: location.state.returnUrl,
            patientName: location.state.patientName,
          }
        : getPatientReturnContext())
    : null;

  const getBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length || parts[0] === "patients") {
      if (parts.length > 1) {
        if (parts.includes("consultations") && parts.includes("new")) {
          return ["Patients", "New Consultation"];
        }
        if (parts.includes("consultations") && parts.includes("details")) {
          return ["Patients", "Consultation Details"];
        }
        return ["Patients", "Patient Profile"];
      }
      return ["Patients", "Directory & Queue"];
    }
    if (parts[0] === "settings") {
      return ["System Settings", "Configuration"];
    }
    return [parts[0].charAt(0).toUpperCase() + parts[0].slice(1)];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentDate = dayjs().format("ddd, MMM D, YYYY");

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 bg-card/70 px-4 sm:px-6 backdrop-blur-md print:hidden">
      {/* Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-8 rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer" />
        <Separator orientation="vertical" className="h-4 bg-border/60" />
        <div className="flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb} className="flex items-center gap-2">
              {idx > 0 && <span className="text-muted-foreground/50">/</span>}
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {returnContext && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(returnContext.returnUrl)}
            className="h-7 gap-1.5 border-primary/30 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/20 hover:text-primary cursor-pointer shadow-xs dark:border-teal-400/40 dark:bg-teal-950/70 dark:text-teal-200 dark:hover:bg-teal-900/80 dark:hover:text-teal-100"
          >
            <ArrowLeft className="size-3" />
            <span>Back to {returnContext.patientName ? returnContext.patientName.split(" ")[0] : "Patient"}</span>
          </Button>
        )}

        {/* Current Date */}
        <span className="hidden md:inline-block text-[11px] font-medium text-muted-foreground">
          {currentDate}
        </span>

        <Separator orientation="vertical" className="hidden sm:block h-4 bg-border/60" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="size-8 rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground cursor-pointer"
          title="Toggle theme"
        >
          {theme === "light" ? (
            <Sun className="size-4 text-amber-500" />
          ) : (
            <Moon className="size-4 text-teal-400" />
          )}
        </Button>
      </div>
    </header>
  );
}

export default TopNavBar;
