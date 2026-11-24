import { Card } from "../../shadcn/card";
import type { AdminSnapshot } from "@/types/DashboardType";
import { ShieldCheck, Cloud, UserCheck } from "lucide-react";
import dayjs from "dayjs";

interface AdminActivitySnapshotProps {
  snapshot?: AdminSnapshot | null;
}

export function AdminActivitySnapshot({
  snapshot,
}: AdminActivitySnapshotProps) {
  if (!snapshot) return null;

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Clinic Administration & Audit</h3>
          </div>
          <p className="text-xs text-muted-foreground">System health, accounts, and recent actions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <UserCheck className="size-3.5 text-emerald-500" />
            <span>{snapshot.activeUsersCount} Active Staff</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Cloud
              className={`size-3.5 ${
                snapshot.isGoogleDriveConnected ? "text-emerald-500" : "text-amber-500"
              }`}
            />
            <span>
              {snapshot.isGoogleDriveConnected ? "Drive Connected" : "Drive Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {snapshot.recentLogs.map((log) => (
          <div key={log.id} className="flex items-center justify-between py-2 text-xs">
            <div className="min-w-0 pr-2">
              <span className="font-semibold text-foreground">
                {log.user.firstName} {log.user.lastName}:
              </span>{" "}
              <span className="text-muted-foreground">{log.details}</span>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {dayjs(log.createdAt).format("MMM D, HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
