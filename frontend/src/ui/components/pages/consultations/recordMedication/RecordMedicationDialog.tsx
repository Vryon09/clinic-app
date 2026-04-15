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
}: IRecordMedicationDialog) {
  return (
    <Dialog open={isAdding} onOpenChange={setIsAdding}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-4 border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Medication Name</FieldLabel>
                <Input {...register(`medicationInput.name`)} />
                {errors.medicationInput?.name && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.medicationInput.name]}
                  />
                )}
              </Field>
              <Field>
                <FieldLabel>Dosage</FieldLabel>
                <Input {...register(`medicationInput.dosage`)} />
                {errors.medicationInput?.dosage && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.medicationInput.dosage]}
                  />
                )}
              </Field>
              <Field>
                <FieldLabel>Frequency</FieldLabel>
                <Input {...register(`medicationInput.frequency`)} />
                {errors.medicationInput?.frequency && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.medicationInput.frequency]}
                  />
                )}
              </Field>
              <Field>
                <FieldLabel>Duration days</FieldLabel>
                <Input
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
                <FieldLabel>Instruction</FieldLabel>
                <Textarea {...register(`medicationInput.instructions`)} />
                {errors.medicationInput?.instructions && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.medicationInput.instructions]}
                  />
                )}
              </Field>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const values = getValues("medicationInput");

                const result = createRecordMedicationSchema.safeParse(values);

                if (!result.success) {
                  result.error.issues.map((issue) => {
                    const field = issue
                      .path[0] as keyof CreateRecordMedicationInput;

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
                  durationDays: 0,
                  instructions: "",
                });

                setIsAdding(false);
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
