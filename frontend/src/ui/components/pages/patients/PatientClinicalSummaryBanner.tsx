import type { ICase } from "@/types/CaseType";
import type { IPatient } from "@/types/PatientType";
import type { IRecord } from "@/types/RecordType";
import { Card } from "../../shadcn/card";
import { Skeleton } from "../../shadcn/skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Pill,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import StatusBadge, { type StatusVariant } from "../../common/StatusBadge";

dayjs.extend(relativeTime);

function getBPStatus(systolic?: number, diastolic?: number): {
  label: string;
  variant: StatusVariant;
} | null {
  if (!systolic || !diastolic) return null;
  if (systolic >= 140 || diastolic >= 90) return { label: "HTN Stage 2", variant: "danger" };
  if (systolic >= 130 || diastolic >= 80) return { label: "HTN Stage 1", variant: "warning" };
  if (systolic >= 120 && diastolic < 80) return { label: "Elevated", variant: "warning" };
  if (systolic >= 90 && diastolic >= 60) return { label: "Normal BP", variant: "success" };
  return { label: "Low BP", variant: "info" };
}

interface PatientClinicalSummaryBannerProps {
  cases?: ICase[];
  patient?: IPatient;
  isCasesLoading: boolean;
}

function PatientClinicalSummaryBanner({
  cases,
  patient,
  isCasesLoading,
}: PatientClinicalSummaryBannerProps) {
  if (isCasesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl bg-muted/60" />
        ))}
      </div>
    );
  }

  // Flatten and sort encounters
  const encounters: IRecord[] = (cases || [])
    .flatMap((c) => c.records || [])
    .sort(
      (a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
    );

  const latestEncounter = encounters[0];
  const latestVitals = latestEncounter?.vitalSigns;
  const latestMeds = latestEncounter?.recordMedications || [];
  const bpStatus = getBPStatus(
    latestVitals?.bloodPressureSystolic,
    latestVitals?.bloodPressureDiastolic,
  );

  const hasAllergies = Boolean(patient?.allergies && patient.allergies.trim().length > 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Latest Vitals Snapshot */}
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Activity className="size-3.5 text-primary" /> Latest Vitals
          </span>
          {bpStatus && (
            <StatusBadge variant={bpStatus.variant} dot={true} className="px-1.5 py-0 text-[10px]">
              {bpStatus.label}
            </StatusBadge>
          )}
        </div>

        {latestVitals && (latestVitals.bloodPressureSystolic || latestVitals.temperature || latestVitals.weightKg) ? (
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground font-mono">
                {latestVitals.bloodPressureSystolic && latestVitals.bloodPressureDiastolic
                  ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}`
                  : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">mmHg</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
              {latestVitals.temperature && <span>{latestVitals.temperature}°C</span>}
              {latestVitals.temperature && latestVitals.weightKg && <span>&middot;</span>}
              {latestVitals.weightKg && <span>{latestVitals.weightKg}kg</span>}
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <span className="text-xs text-muted-foreground italic">No vitals on file</span>
          </div>
        )}
      </Card>

      {/* 2. Last Visit & Encounters */}
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Calendar className="size-3.5 text-primary" /> Last Encounter
          </span>
          <span className="rounded bg-muted/60 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
            {encounters.length} {encounters.length === 1 ? "Visit" : "Visits"}
          </span>
        </div>

        {latestEncounter ? (
          <div className="mt-2 space-y-0.5">
            <p className="text-sm font-bold text-foreground">
              {dayjs(latestEncounter.visitDate).format("MMM DD, YYYY")}
            </p>
            <p className="text-[11px] text-muted-foreground truncate" title={latestEncounter.diagnosis || undefined}>
              {latestEncounter.diagnosis || "Consultation Completed"}
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <span className="text-xs text-muted-foreground italic">No prior visits</span>
          </div>
        )}
      </Card>

      {/* 3. Active Prescriptions */}
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Pill className="size-3.5 text-primary" /> Recent Rx
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {latestMeds.length} items
          </span>
        </div>

        {latestMeds.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {latestMeds.slice(0, 2).map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium text-foreground truncate max-w-[140px]"
                title={`${m.name} ${m.dosage}`}
              >
                <span className="font-serif italic text-primary">℞</span>
                <span className="truncate">{m.name}</span>
              </span>
            ))}
            {latestMeds.length > 2 && (
              <span className="rounded bg-muted/50 px-1 py-0.5 text-[9px] font-mono text-muted-foreground">
                +{latestMeds.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <div className="mt-2">
            <span className="text-xs text-muted-foreground italic">No recent medications</span>
          </div>
        )}
      </Card>

      {/* 4. Safety & Clinical Status */}
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {hasAllergies ? (
              <ShieldAlert className="size-3.5 text-rose-600 dark:text-rose-400" />
            ) : (
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            Clinical Safety
          </span>
          <StatusBadge
            variant={hasAllergies ? "danger" : "success"}
            dot={true}
            className="px-1.5 py-0 text-[10px]"
          >
            {hasAllergies ? "Allergy Alert" : "NKDA Verified"}
          </StatusBadge>
        </div>

        <div className="mt-2 space-y-1">
          {hasAllergies ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-700 dark:text-rose-300 truncate max-w-[200px]" title={patient?.allergies || ""}>
                <ShieldAlert className="size-3 text-rose-600 shrink-0" /> {patient?.allergies}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground">
                <CheckCircle2 className="size-3 text-emerald-600" /> NKDA
              </span>
              <span className="text-[10px] text-muted-foreground">No Known Allergies</span>
            </div>
          )}
          <p className="text-[10px] font-mono text-muted-foreground truncate">
            Cases: {cases?.map((c) => c.caseName).join(", ") || "Default"}
          </p>
        </div>
      </Card>
    </div>
  );
}

export default PatientClinicalSummaryBanner;
