import { Card } from "../../shadcn/card";
import { Button } from "../../shadcn/button";
import { UserPlus, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export function QuickActionsCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
      <p className="text-xs text-muted-foreground mb-4">Fast shortcuts for daily clinical routines</p>

      <div className="flex flex-col gap-2.5">
        <Button
          onClick={() => navigate("/patients")}
          variant="outline"
          className="h-9 w-full justify-start gap-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
        >
          <UserPlus className="size-4 text-primary" />
          <span>Add / Search Patients</span>
        </Button>

        <Button
          onClick={() => navigate("/patients")}
          variant="outline"
          className="h-9 w-full justify-start gap-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
        >
          <Users className="size-4 text-primary" />
          <span>Patient Directory</span>
        </Button>

        {user?.role === "ADMIN" && (
          <Button
            onClick={() => navigate("/settings")}
            variant="outline"
            className="h-9 w-full justify-start gap-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary cursor-pointer border-border/80"
          >
            <Settings className="size-4 text-primary" />
            <span>Clinic Settings & Backups</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
