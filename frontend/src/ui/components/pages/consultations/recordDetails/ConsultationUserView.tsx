import type { IRecord } from "@/types/RecordType";
import type { IVitalSigns } from "@/types/VitalSignsType";
import type { IRecordMedications } from "@/types/RecordMedicationsType";
import { Activity, Pill, Stethoscope, Thermometer, Weight } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
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
    <div className="rounded-xl border border-border/80 bg-card p-4">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-foreground">
        {value || <span className="italic text-muted-foreground">N/A</span>}
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
      : "N/A";

  const tempValue = vitalSigns?.temperature
    ? `${vitalSigns.temperature}°C`
    : "N/A";

  const weightValue = vitalSigns?.weightKg
    ? `${vitalSigns.weightKg} kg`
    : "N/A";

  return (
    <div className="space-y-8 pb-10">
      {/* Visit Details */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Stethoscope className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Visit Details
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCard label="Symptoms" value={record?.symptoms} />
          <InfoCard label="Signs" value={record?.signs} />
          <InfoCard label="Diagnosis" value={record?.diagnosis} />
        </div>
      </section>

      {/* Vital Signs */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Vital Signs</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Blood Pressure" value={bpValue} icon={Activity} />
          <StatCard label="Temperature" value={tempValue} icon={Thermometer} />
          <StatCard label="Weight" value={weightValue} icon={Weight} />
        </div>
      </section>

      {/* Medications */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Pill className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Prescription Medications
          </h2>
        </div>

        {!recordMedications?.length ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No medications prescribed for this consultation.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recordMedications.map((medication) => (
              <div
                key={medication.id}
                className="rounded-xl border border-border/80 bg-card p-4"
              >
                <p className="mb-3 text-sm font-semibold text-foreground">
                  {medication.name}
                </p>

                <div className="mb-3 grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-muted/40 px-2.5 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Dosage
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {medication.dosage || "—"}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted/40 px-2.5 py-2">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Frequency
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {medication.frequency || "—"}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted/40 px-2.5 py-2">
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
                      Instructions
                    </p>
                    <p className="text-xs text-foreground">
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
