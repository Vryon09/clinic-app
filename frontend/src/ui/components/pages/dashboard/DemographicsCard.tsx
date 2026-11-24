import { Card } from "../../shadcn/card";
import type { DemographicsData, DoctorWorkloadItem } from "@/types/DashboardType";

interface DemographicsCardProps {
  demographics?: DemographicsData;
  doctorWorkload?: DoctorWorkloadItem[];
}

export function DemographicsCard({
  demographics,
  doctorWorkload,
}: DemographicsCardProps) {
  const totalSex = (demographics?.male ?? 0) + (demographics?.female ?? 0);
  const malePct = totalSex > 0 ? Math.round(((demographics?.male ?? 0) / totalSex) * 100) : 50;
  const femalePct = totalSex > 0 ? 100 - malePct : 50;

  const ageBuckets = demographics?.ageBuckets || {
    "0-17": 0,
    "18-35": 0,
    "36-59": 0,
    "60+": 0,
  };
  const maxAgeCount = Math.max(...Object.values(ageBuckets), 1);

  return (
    <Card className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Patient Demographics & Staff</h3>
        <p className="text-xs text-muted-foreground">Demographic profile and provider caseload</p>
      </div>

      {/* Sex Distribution */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Sex Ratio</span>
          <span className="text-foreground">
            {demographics?.male ?? 0} M ({malePct}%) / {demographics?.female ?? 0} F ({femalePct}%)
          </span>
        </div>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div style={{ width: `${malePct}%` }} className="bg-sky-500" />
          <div style={{ width: `${femalePct}%` }} className="bg-rose-500" />
        </div>
      </div>

      {/* Age Groups */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Age Distribution</span>
        <div className="grid grid-cols-4 gap-2 text-center">
          {Object.entries(ageBuckets).map(([group, count]) => {
            const pct = Math.round((count / maxAgeCount) * 100);
            return (
              <div key={group} className="space-y-1">
                <div className="flex h-12 items-end justify-center rounded bg-muted/30 p-1">
                  <div
                    style={{ height: `${Math.max(15, pct)}%` }}
                    className="w-full rounded-sm bg-primary/80 transition-all"
                  />
                </div>
                <div className="text-[10px] font-semibold text-foreground">{group}</div>
                <div className="text-[10px] text-muted-foreground">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provider Caseload */}
      {doctorWorkload && doctorWorkload.length > 0 && (
        <div className="border-t border-border/40 pt-3 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Active Cases by Doctor</span>
          <div className="space-y-1.5">
            {doctorWorkload.map((doc) => (
              <div key={doc.doctorName} className="flex justify-between text-xs">
                <span className="text-foreground">{doc.doctorName}</span>
                <span className="font-semibold text-primary">{doc.count} cases</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
