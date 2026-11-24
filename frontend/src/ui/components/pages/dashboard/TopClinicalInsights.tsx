import { Card } from "../../shadcn/card";
import type { TopClinicalItem } from "@/types/DashboardType";
import { Pill, Activity } from "lucide-react";

interface TopClinicalInsightsProps {
  topDiagnoses: TopClinicalItem[];
  topMedications: TopClinicalItem[];
}

export function TopClinicalInsights({
  topDiagnoses,
  topMedications,
}: TopClinicalInsightsProps) {
  const maxDiag = topDiagnoses.length ? Math.max(...topDiagnoses.map((d) => d.count)) : 1;
  const maxMed = topMedications.length ? Math.max(...topMedications.map((m) => m.count)) : 1;

  return (
    <Card className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Clinical Insights</h3>
        <p className="text-xs text-muted-foreground">Top diagnoses and prescriptions</p>
      </div>

      {/* Top Diagnoses */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Activity className="size-3.5 text-primary" />
          <span>Top Diagnoses</span>
        </div>
        {!topDiagnoses.length ? (
          <p className="text-[11px] text-muted-foreground">No recorded diagnoses in this period.</p>
        ) : (
          <div className="space-y-2">
            {topDiagnoses.map((diag) => {
              const pct = Math.round((diag.count / maxDiag) * 100);
              return (
                <div key={diag.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate font-medium text-foreground max-w-[200px]" title={diag.name}>
                      {diag.name}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{diag.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border/40" />

      {/* Top Medications */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Pill className="size-3.5 text-primary" />
          <span>Most Prescribed Medications</span>
        </div>
        {!topMedications.length ? (
          <p className="text-[11px] text-muted-foreground">No medications prescribed in this period.</p>
        ) : (
          <div className="space-y-2">
            {topMedications.map((med) => {
              const pct = Math.round((med.count / maxMed) * 100);
              return (
                <div key={med.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate font-medium text-foreground max-w-[200px]" title={med.name}>
                      {med.name}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{med.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
