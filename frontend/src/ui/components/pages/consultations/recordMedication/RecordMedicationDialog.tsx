import { Input } from "@/ui/components/shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/dialog";
import { Field, FieldError, FieldLabel } from "../../../shadcn/field";
import { Textarea } from "@/ui/components/shadcn/textarea";
import { Button } from "@/ui/components/shadcn/button";
import type { IRecordMedicationDialog } from "@/types/RecordMedicationsType";
import {
  createRecordMedicationSchema,
  type CreateRecordMedicationInput,
} from "@/schemas/recordMedication";

function RecordMedicationDialog({
  register,
  isAdding,
  setIsAdding,
  errors,
  addMedication,
  getValues,
  setError,
  setValue,
  clearErrors,
}: IRecordMedicationDialog) {
  return (
    <Dialog
      open={isAdding}
      onOpenChange={() => {
        if (isAdding) {
          setIsAdding(false);

          setValue("medicationInput.durationDays", undefined);
          return;
        }
        setIsAdding(true);
      }}
    >
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Medication
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1">
          {/* Input grid */}
          <div className="mb-4 grid grid-cols-2 gap-3 border-b border-border/60 pb-4">
            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Medication Name
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-sm"
                placeholder="e.g. Amoxicillin"
                {...register(`medicationInput.name`)}
              />
              {errors.medicationInput?.name && (
                <FieldError
                  className="text-xs"
                  errors={[errors.medicationInput.name]}
                />
              )}
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Dosage
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-sm"
                placeholder="e.g. 500mg"
                {...register(`medicationInput.dosage`)}
              />
              {errors.medicationInput?.dosage && (
                <FieldError
                  className="text-xs"
                  errors={[errors.medicationInput.dosage]}
                />
              )}
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Frequency
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-sm"
                placeholder="e.g. 3x a day"
                {...register(`medicationInput.frequency`)}
              />
              {errors.medicationInput?.frequency && (
                <FieldError
                  className="text-xs"
                  errors={[errors.medicationInput.frequency]}
                />
              )}
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Duration{" "}
                <span className="text-muted-foreground/60">(days)</span>
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-sm"
                placeholder="e.g. 7"
                {...register(`medicationInput.durationDays`, {
                  valueAsNumber: true,
                })}
              />
              {errors.medicationInput?.durationDays && (
                <FieldError
                  className="text-xs"
                  errors={[errors.medicationInput.durationDays]}
                />
              )}
            </Field>

            <Field className="col-span-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Instructions
              </FieldLabel>
              <Textarea
                className="min-h-[72px] resize-none rounded-lg border-border/80 text-sm"
                placeholder="e.g. Take after meals"
                {...register(`medicationInput.instructions`)}
              />
              {errors.medicationInput?.instructions && (
                <FieldError
                  className="text-xs"
                  errors={[errors.medicationInput.instructions]}
                />
              )}
            </Field>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                setIsAdding(false);
                setValue("medicationInput.durationDays", undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                const values = getValues("medicationInput");

                const result = createRecordMedicationSchema.safeParse(values);

                if (!result.success) {
                  result.error.issues.map((issue) => {
                    const field =
                      issue.path[0] as keyof CreateRecordMedicationInput;

                    setError(`medicationInput.${field}`, {
                      message: issue.message,
                    });
                  });
                  return;
                }

                addMedication(result.data);

                setValue("medicationInput", {
                  name: "",
                  dosage: "",
                  frequency: "",
                  durationDays: undefined,
                  instructions: "",
                });

                setIsAdding(false);

                clearErrors("medicationInput");
              }}
            >
              Add Medication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RecordMedicationDialog;
