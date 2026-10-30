import { Card, CardContent, CardHeader, CardTitle } from "../../../shadcn/card";
import { Button } from "../../../shadcn/button";
import { useState } from "react";
import { ChevronUp, Clock, Pill, Plus } from "lucide-react";
import AddedRecordMedicationList from "../recordMedication/AddedRecordMedicationList";
import type { IRecordMedicationForm } from "@/types/RecordMedicationsType";
import {
  createRecordMedicationSchema,
  type CreateRecordMedicationInput,
} from "@/schemas/recordMedication";
import { Input } from "../../../shadcn/input";
import { Field, FieldError, FieldLabel } from "../../../shadcn/field";

const FREQUENCY_PRESETS = [
  "Once daily (OD)",
  "Twice daily (BID)",
  "3x daily (TID)",
  "As needed (PRN)",
];

const DURATION_PRESETS = [3, 5, 7, 14, 30];

function RecordMedicationForm({
  recordMedicationField,
  addMedication,
  deleteMedication,
  register,
  getValues,
  setValue,
  errors,
  setError,
  clearErrors,
}: IRecordMedicationForm) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleAddMedicationInline = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const values = getValues("medicationInput");

    const result = createRecordMedicationSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateRecordMedicationInput;
        setError(`medicationInput.${field}`, {
          message: issue.message,
        });
      });
      return;
    }

    addMedication(result.data);

    // Reset input fields
    setValue("medicationInput.name", "");
    setValue("medicationInput.dosage", "");
    setValue("medicationInput.frequency", "");
    setValue("medicationInput.durationDays", undefined);
    setValue("medicationInput.instructions", "");
    clearErrors("medicationInput");
  };

  return (
    <Card className="col-span-full rounded-xl border border-border/80 bg-card shadow-2xs md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pill className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Prescription &amp; Medications
              </CardTitle>
              {recordMedicationField.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary font-mono">
                  {recordMedicationField.length} {recordMedicationField.length === 1 ? "drug" : "drugs"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Add medication orders, dosage, instructions, and regimens
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
        >
          {isOpen ? (
            <>
              <ChevronUp className="size-3.5" />
              <span>Hide Entry Form</span>
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              <span>Add Drug</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Inline Rapid Entry Form */}
        {isOpen && (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="font-serif italic font-bold text-primary">℞</span>
                <span>Fast Medication Entry</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Press &quot;Add to Prescription&quot; to queue</span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Drug Name */}
              <Field className="sm:col-span-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Drug Name &amp; Strength <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  className="h-8.5 rounded-lg border-border/80 bg-background text-xs"
                  placeholder="e.g. Amoxicillin, Paracetamol"
                  {...register("medicationInput.name")}
                />
                {errors.medicationInput?.name && (
                  <FieldError
                    className="text-[11px]"
                    errors={[errors.medicationInput.name]}
                  />
                )}
              </Field>

              {/* Dosage */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Dosage / Form <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  className="h-8.5 rounded-lg border-border/80 bg-background text-xs"
                  placeholder="e.g. 500mg, 1 tab"
                  {...register("medicationInput.dosage")}
                />
                {errors.medicationInput?.dosage && (
                  <FieldError
                    className="text-[11px]"
                    errors={[errors.medicationInput.dosage]}
                  />
                )}
              </Field>

              {/* Duration */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Duration <span className="text-muted-foreground/70 font-mono">(Days)</span>
                </FieldLabel>
                <Input
                  className="h-8.5 rounded-lg border-border/80 bg-background text-xs font-mono"
                  type="number"
                  placeholder="7"
                  {...register("medicationInput.durationDays", {
                    valueAsNumber: true,
                  })}
                />
                {errors.medicationInput?.durationDays && (
                  <FieldError
                    className="text-[11px]"
                    errors={[errors.medicationInput.durationDays]}
                  />
                )}
              </Field>

              {/* Frequency */}
              <Field className="sm:col-span-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Frequency / Timing <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  className="h-8.5 rounded-lg border-border/80 bg-background text-xs"
                  placeholder="e.g. Twice daily after meals"
                  {...register("medicationInput.frequency")}
                />
                {errors.medicationInput?.frequency && (
                  <FieldError
                    className="text-[11px]"
                    errors={[errors.medicationInput.frequency]}
                  />
                )}

                {/* Frequency Quick Presets */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {FREQUENCY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setValue("medicationInput.frequency", preset, { shouldValidate: true })}
                      className="cursor-pointer rounded-md border border-border/60 bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Instructions */}
              <Field className="sm:col-span-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Special Instructions
                </FieldLabel>
                <Input
                  className="h-8.5 rounded-lg border-border/80 bg-background text-xs"
                  placeholder="e.g. Take with full glass of water, complete course"
                  {...register("medicationInput.instructions")}
                />
                {errors.medicationInput?.instructions && (
                  <FieldError
                    className="text-[11px]"
                    errors={[errors.medicationInput.instructions]}
                  />
                )}

                {/* Duration Presets */}
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" /> Duration:
                  </span>
                  {DURATION_PRESETS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setValue("medicationInput.durationDays", days, { shouldValidate: true })}
                      className="cursor-pointer rounded-md border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
              <Button
                type="button"
                size="sm"
                onClick={handleAddMedicationInline}
                className="h-8 gap-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>Add to Prescription</span>
              </Button>
            </div>
          </div>
        )}

        {/* Existing Added Medications List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prescribed Medications ({recordMedicationField.length})
            </span>
          </div>
          <AddedRecordMedicationList
            recordMedicationField={recordMedicationField}
            deleteMedication={deleteMedication}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default RecordMedicationForm;
