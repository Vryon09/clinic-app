import { Card } from "@/ui/components/shadcn/card";
import { Separator } from "@/ui/components/shadcn/separator";
import ActivityLogTable from "./ActivityLogTable";

function ActivityLog() {
  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Activity Log</h2>
        <p className="text-xs text-muted-foreground">
          View a audit history of user activities and system actions performed within the application.
        </p>
      </div>

      <Separator className="bg-border/60" />

      <ActivityLogTable />
    </Card>
  );
}

export default ActivityLog;
