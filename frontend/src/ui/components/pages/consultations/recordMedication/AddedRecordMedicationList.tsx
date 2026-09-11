import type { IAddedRecordMedicationList } from "@/types/RecordMedicationsType";
import { Button } from "@/ui/components/shadcn/button";
import { Pill, Trash2 } from "lucide-react";

function AddedRecordMedicationList({
  recordMedicationField,
  deleteMedication,
}: IAddedRecordMedicationList) {
  if (!recordMedicationField.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 py-8 text-center">
        <Pill className="mb-2 size-5 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">
          No medications added yet. Click &ldquo;Add Medication&rdquo; to prescribe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {recordMedicationField.map((medication, i) => (
        <div
          key={medication.id}
          className="rounded-lg border border-border/70 bg-card p-3.5"
        >
          {/* Name + delete */}
          <div className="mb-2.5 flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {medication.name}
            </p>
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-7 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => deleteMedication(i)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
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

          {/* Instructions */}
          {medication.instructions && (
            <div className="mt-2.5 border-t border-border/50 pt-2">
              <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Instructions
              </p>
              <p className="text-xs text-foreground">{medication.instructions}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AddedRecordMedicationList;
