import type { IAddedRecordMedicationList } from "@/types/RecordMedicationsType";
import { Button } from "@/ui/components/shadcn/button";
import { Clock, Info, Pill, Trash2 } from "lucide-react";

function AddedRecordMedicationList({
  recordMedicationField,
  deleteMedication,
}: IAddedRecordMedicationList) {
  if (!recordMedicationField.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-8 text-center">
        <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
          <Pill className="size-4" />
        </div>
        <p className="text-xs font-medium text-foreground">No medications prescribed yet</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Use the fast entry form above to order medications for this consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recordMedicationField.map((medication, i) => (
        <div
          key={medication.id}
          className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-2xs hover:border-border transition-colors"
        >
          {/* Left: Rx icon + drug name + dosage */}
          <div className="flex items-start gap-2.5">
            <span className="font-serif italic font-bold text-primary text-base leading-none mt-0.5 select-none">
              ℞
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground tracking-tight">
                  {medication.name}
                </span>
                <span className="inline-flex items-center rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.2 font-mono text-[10px] font-medium text-foreground">
                  {medication.dosage}
                </span>
              </div>

              {/* Regimen details */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  {medication.frequency}
                </span>

                {medication.durationDays && (
                  <span className="flex items-center gap-1 font-mono text-muted-foreground">
                    <Clock className="size-3 text-muted-foreground/70" />
                    {medication.durationDays} {medication.durationDays === 1 ? "day" : "days"}
                  </span>
                )}
              </div>

              {medication.instructions && (
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground italic">
                  <Info className="size-3 text-primary/70 shrink-0" />
                  <span>{medication.instructions}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right: Remove button */}
          <div className="flex items-center justify-end">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="size-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
              onClick={() => deleteMedication(i)}
              title="Remove medication"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AddedRecordMedicationList;
