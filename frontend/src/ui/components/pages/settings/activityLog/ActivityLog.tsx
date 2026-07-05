import { Card } from "@/ui/components/shadcn/card";
import { Separator } from "@/ui/components/shadcn/separator";

function ActivityLog() {
  return (
    <Card className="space-y-4 px-8 py-4">
      <div>
        <p className="text-2xl font-semibold">Activity Log</p>
        <p className="text-sm text-neutral-500">
          View a history of user activities and actions performed within the
          application.
        </p>
      </div>

      <Separator />
    </Card>
  );
}

export default ActivityLog;
