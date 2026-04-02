// import type { IRecordForm } from "@/types/RecordType";
import type { IRecordMedicationForm } from "@/types/RecordType";
import { Card } from "../../shadcn/card";
import { Field, FieldError, FieldLabel } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Textarea } from "../../shadcn/textarea";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import { createRecordMedicationSchema } from "@/schemas/recordMedication";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";

function RecordMedicationForm({
  recordMedicationField,
  addMedication,
  deleteMedication,
  register,
  getValues,
  setValue,
  errors,
  setError,
}: IRecordMedicationForm) {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  console.log(errors);
  return (
    <Card className="col-span-2 px-4 py-3">
      <div className="flex flex-col">
        <div className="mb-2 flex justify-between">
          <p className="mb-2 text-xl font-semibold">Prescription Medication</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsAdding((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <span>
                  <Plus />
                </span>
                Add Medication
              </>
            )}
          </Button>
        </div>

        <div className="mb-2">
          <p className="font-semibold">
            Added medication ({recordMedicationField.length})
          </p>

          <div className="mt-2 space-y-2">
            {!recordMedicationField.length ? (
              <p className="text-muted-foreground text-center text-sm">
                No added medication. Click "Add Medication" button to add.
              </p>
            ) : (
              recordMedicationField.map((medication, i) => (
                <Card
                  key={medication.id}
                  className="flex flex-col gap-4 px-4 py-2"
                >
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">{medication.name}</p>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => deleteMedication(i)}
                      className="cursor-pointer"
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3">
                    <div>
                      <p className="text-sm uppercase">Dosage</p>
                      <p className="font-semibold">{medication.dosage}</p>
                    </div>

                    <div>
                      <p className="text-sm uppercase">Frequency</p>
                      <p className="font-semibold">{medication.frequency}</p>
                    </div>

                    <div>
                      <p className="text-sm uppercase">Duration Days</p>
                      <p className="font-semibold">
                        {medication.durationDays}{" "}
                        {medication.durationDays
                          ? medication.durationDays > 1
                            ? "days"
                            : "day"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-2">
                    <p className="text-sm uppercase">Instructions</p>
                    <p className="text-neutral-700">
                      {medication.instructions
                        ? medication.instructions
                        : "N/A"}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

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

                    const result =
                      createRecordMedicationSchema.safeParse(values);

                    if (!result.success) {
                      result.error.issues.map((issue) => {
                        const field = issue.path[0] as keyof typeof values;

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
      </div>
    </Card>
  );
}

export default RecordMedicationForm;
