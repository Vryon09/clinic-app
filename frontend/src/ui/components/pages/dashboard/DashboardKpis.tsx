import { MetricCard } from "../../common/MetricCard";
import type { DashboardKPIs, DashboardRange } from "@/types/DashboardType";
import { Stethoscope, Users, BriefcaseMedical, FlaskConical } from "lucide-react";

interface DashboardKpisProps {
  kpis?: DashboardKPIs;
  range: DashboardRange;
}

export function DashboardKpis({ kpis, range }: DashboardKpisProps) {
  const rangeLabel = range === "7d" ? "7 days" : range === "90d" ? "90 days" : "30 days";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Today's Consultations"
        value={kpis?.recordsToday ?? 0}
        subtitle={`${kpis?.totalRecordsInRange ?? 0} in past ${rangeLabel}`}
        icon={Stethoscope}
        trend={`${kpis?.recordsToday ?? 0} today`}
      />
      <MetricCard
        title="Active Patients"
        value={kpis?.activePatients ?? 0}
        subtitle={`+${kpis?.newPatientsInRange ?? 0} new in past ${rangeLabel}`}
        icon={Users}
        trend="Total active"
      />
      <MetricCard
        title="Active Cases"
        value={kpis?.activeCases ?? 0}
        subtitle="Open clinical episodes"
        icon={BriefcaseMedical}
      />
      <MetricCard
        title="Lab Results"
        value={kpis?.labResultsInRange ?? 0}
        subtitle={`${kpis?.totalLabResults ?? 0} all-time files`}
        icon={FlaskConical}
        trend={`+${kpis?.labResultsInRange ?? 0} in ${rangeLabel}`}
      />
    </div>
  );
}
