import { useState } from "react";
import { useNavigate } from "react-router";
import { UserPlus } from "lucide-react";
import { useDashboardSummary } from "@/services/apiDashboard";
import type { DashboardRange } from "@/types/DashboardType";
import { DashboardKpis } from "./DashboardKpis";
import { ConsultationTrendChart } from "./ConsultationTrendChart";
import { RecentConsultationsList } from "./RecentConsultationsList";
import { DemographicsCard } from "./DemographicsCard";
import { Button } from "../../shadcn/button";
import { Skeleton } from "../../shadcn/skeleton";
import { useAccess } from "@/hooks/useAccess";

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>("30d");
  const { data, isLoading } = useDashboardSummary(range);
  const navigate = useNavigate();
  const { isHidden } = useAccess();

  return (
    <div className="space-y-6 pb-8">
      {/* Header section with Range Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Clinic Dashboard
            </h1>
            <span className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium">
              Real-time Overview
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Clinical activity, patient demographics, and operational insights.
          </p>
        </div>

        {/* Range Buttons + Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-1">
            {(["7d", "30d", "90d"] as DashboardRange[]).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "ghost"}
                size="sm"
                onClick={() => setRange(r)}
                className={`h-7 px-3 text-xs font-semibold rounded-md cursor-pointer ${
                  range === r ? "shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "Past 7 Days" : r === "90d" ? "Past 90 Days" : "Past 30 Days"}
              </Button>
            ))}
          </div>

          {!isHidden("patients") && (
            <Button
              onClick={() => navigate("/patients")}
              size="sm"
              className="h-9 gap-2 rounded-lg px-3.5 text-xs font-semibold cursor-pointer"
            >
              <UserPlus className="size-4" />
              <span>Add / Search Patients</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <DashboardKpis kpis={data?.kpis} range={range} />

          {/* Consultation Trend + Demographics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ConsultationTrendChart data={data?.consultationTrends || []} />
            </div>
            <div>
              <DemographicsCard
                demographics={data?.demographics}
                doctorWorkload={data?.doctorWorkload}
              />
            </div>
          </div>

          {/* Recent Consultations */}
          <RecentConsultationsList
            consultations={data?.recentConsultations || []}
          />
        </>
      )}
    </div>
  );
}
