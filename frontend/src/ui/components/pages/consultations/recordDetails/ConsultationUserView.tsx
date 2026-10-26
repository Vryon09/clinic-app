import type { IRecord } from "@/types/RecordType";
import type { IVitalSigns } from "@/types/VitalSignsType";
import type { IRecordMedications } from "@/types/RecordMedicationsType";
import { Activity, Pill, Stethoscope, Thermometer, Weight } from "lucide-react";
import StatusBadge from "../../../common/StatusBadge";
import EmptyState from "../../../common/EmptyState";

function StatCard({
  label,
  value,
  icon: Icon,
  unit,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  unit?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-bold tracking-tight text-foreground font-sans">
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-xs sm:text-sm leading-relaxed text-foreground font-medium">
        {value || <span className="italic text-muted-foreground">None documented</span>}
      </p>
    </div>
  );
}

function ConsultationUserView({
  record,
  vitalSigns,
  recordMedications,
}: {
  record: IRecord;
  vitalSigns: IVitalSigns;
  recordMedications: IRecordMedications[];
}) {
  const bpValue =
    vitalSigns?.bloodPressureSystolic && vitalSigns?.bloodPressureDiastolic
      ? `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}`
      : "—";

  const tempValue = vitalSigns?.temperature
    ? `${vitalSigns.temperature}`
    : "—";

  const weightValue = vitalSigns?.weightKg
    ? `${vitalSigns.weightKg}`
    : "—";

  return (
    <div className="space-y-6 pb-10">
      {/* Visit Details */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-4 text-primary" />
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Clinical Visit Findings
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCard label="Chief Symptoms" value={record?.symptoms} />
          <InfoCard label="Physical Signs" value={record?.signs} />
          <InfoCard label="Primary Diagnosis" value={record?.diagnosis} />
        </div>
      </section>

      {/* Vital Signs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Patient Vitals
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Blood Pressure"
            value={bpValue}
            icon={Activity}
            unit={bpValue !== "—" ? "mmHg" : undefined}
          />
          <StatCard
            label="Body Temperature"
            value={tempValue}
            icon={Thermometer}
            unit={tempValue !== "—" ? "°C" : undefined}
          />
          <StatCard
            label="Body Weight"
            value={weightValue}
            icon={Weight}
            unit={weightValue !== "—" ? "kg" : undefined}
          />
        </div>
      </section>

      {/* Medications */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Prescribed Medications
            </h2>
          </div>
          {recordMedications?.length ? (
            <StatusBadge variant="info">
              {recordMedications.length} Rx {recordMedications.length === 1 ? "Item" : "Items"}
            </StatusBadge>
          ) : null}
        </div>

        {!recordMedications?.length ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
            <EmptyState
              title="No Medications Prescribed"
              description="No pharmacological treatments were recorded for this encounter."
              showMascot={false}
              icon={Pill}
              className="p-4 sm:p-4"
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recordMedications.map((medication) => (
              <div
                key={medication.id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-foreground">
                    {medication.name}
                  </p>
                  <StatusBadge variant="neutral">Active Rx</StatusBadge>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-border/40 bg-muted/30 px-2.5 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Dosage
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {medication.dosage || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-muted/30 px-2.5 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Frequency
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {medication.frequency || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-muted/30 px-2.5 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Duration
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {medication.durationDays
                        ? `${medication.durationDays} ${medication.durationDays > 1 ? "days" : "day"}`
                        : "—"}
                    </p>
                  </div>
                </div>

                {medication.instructions && (
                  <div className="border-t border-border/50 pt-2.5">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Clinical Instructions
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {medication.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ConsultationUserView;
