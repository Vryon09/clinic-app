import type { ICase } from "@/types/CaseType";
import type { IRecord } from "@/types/RecordType";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../shadcn/sheet";
import { Button } from "../../../shadcn/button";
import dayjs from "dayjs";
import {
  Activity,
  Calendar,
  Copy,
  Folder,
  History,
  Pill,
  Plus,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

interface FlattenedEncounter extends IRecord {
  caseName: string;
}

interface PatientHistoryDrawerProps {
  cases?: ICase[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onInsertDiagnosis?: (diag: string) => void;
  onInsertMedication?: (med: {
    name: string;
    dosage: string;
    frequency: string;
    durationDays?: number;
    instructions?: string;
  }) => void;
}

function PatientHistoryDrawer({
  cases,
  isOpen,
  setIsOpen,
  onInsertDiagnosis,
  onInsertMedication,
}: PatientHistoryDrawerProps) {
  // Extract and flatten all encounters across cases
  const encounters: FlattenedEncounter[] = (cases || [])
    .flatMap((c) =>
      (c.records || []).map((r) => ({
        ...r,
        caseName: c.caseName,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
    );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col bg-background border-l border-border/80 shadow-2xl"
      >
        <SheetHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold tracking-tight text-foreground">
                Patient Encounter History
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Past consultations, diagnoses, vitals, and prescribed medications
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Encounter Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!encounters.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/80 rounded-xl bg-muted/10 p-6">
              <Stethoscope className="size-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">No Previous Encounters</p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                This appears to be the patient's first clinical consultation in the system.
              </p>
            </div>
          ) : (
            encounters.map((enc) => (
              <div
                key={enc.id}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3"
              >
                {/* Header: Date + Case Name */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    <span>{dayjs(enc.visitDate).format("MMM DD, YYYY")}</span>
                  </div>
                  <span className="flex items-center gap-1 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    <Folder className="size-3" />
                    {enc.caseName}
                  </span>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="space-y-1.5 text-xs">
                  {enc.diagnosis ? (
                    <div className="rounded-md bg-primary/5 border border-primary/15 p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-primary uppercase">
                          Diagnosis
                        </span>
                        {onInsertDiagnosis && (
                          <button
                            type="button"
                            onClick={() => {
                              onInsertDiagnosis(enc.diagnosis!);
                              toast.success("Diagnosis copied to current note");
                            }}
                            className="flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer"
                          >
                            <Copy className="size-2.5" />
                            <span>Copy</span>
                          </button>
                        )}
                      </div>
                      <p className="font-medium text-foreground text-xs mt-0.5">
                        {enc.diagnosis}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-[11px] italic">No diagnosis recorded</p>
                  )}

                  {enc.symptoms && (
                    <div className="text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">Symptoms: </span>
                      {enc.symptoms}
                    </div>
                  )}
                </div>

                {/* Vitals Summary */}
                {enc.vitalSigns && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                      <Activity className="size-3 text-primary" /> Vitals:
                    </span>
                    {enc.vitalSigns.bloodPressureSystolic && enc.vitalSigns.bloodPressureDiastolic && (
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                        BP {enc.vitalSigns.bloodPressureSystolic}/{enc.vitalSigns.bloodPressureDiastolic}
                      </span>
                    )}
                    {enc.vitalSigns.temperature && (
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                        {enc.vitalSigns.temperature}°C
                      </span>
                    )}
                    {enc.vitalSigns.weightKg && (
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                        {enc.vitalSigns.weightKg}kg
                      </span>
                    )}
                  </div>
                )}

                {/* Medications Prescribed */}
                {enc.recordMedications && enc.recordMedications.length > 0 && (
                  <div className="border-t border-border/50 pt-2 space-y-1.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Pill className="size-3" /> Prescriptions ({enc.recordMedications.length})
                    </span>

                    <div className="space-y-1">
                      {enc.recordMedications.map((med, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2 py-1 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-foreground text-[11px]">
                              {med.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground ml-1.5">
                              {med.dosage} &middot; {med.frequency}
                            </span>
                          </div>

                          {onInsertMedication && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 gap-1 px-1.5 text-[10px] text-primary hover:bg-primary/10 cursor-pointer"
                              onClick={() => {
                                onInsertMedication({
                                  name: med.name,
                                  dosage: med.dosage,
                                  frequency: med.frequency,
                                  durationDays: med.durationDays,
                                  instructions: med.instructions,
                                });
                                toast.success(`Added ${med.name} to prescription`);
                              }}
                            >
                              <Plus className="size-2.5" />
                              <span>Refill</span>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PatientHistoryDrawer;
