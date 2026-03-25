// import type { IRecordForm } from "@/types/RecordType";
import type { IRecordMedicationForm } from "@/types/RecordType";
import { Card } from "../../shadcn/card";
import { Field, FieldLabel } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Textarea } from "../../shadcn/textarea";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import { createRecordMedicationSchema } from "@/schemas/recordMedication";
import { Trash2 } from "lucide-react";

function RecordMedicationForm({
  recordMedicationField,
  addMedication,
  deleteMedication,
  register,
  getValues,
  setValue,
}: IRecordMedicationForm) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  return (
    <Card className="col-span-2">
      <div className="flex flex-col">
        <p>Record Medication</p>
        <div>
          <p>Added medication</p>
          {recordMedicationField.map((field, i) => (
            <div key={field.id} className="flex gap-4">
              <p>{field.name}</p>
              <p>{field.dosage}</p>
              <p>{field.frequency}</p>
              <p>{field.durationDays} days</p>
              <p>{field.instructions}</p>

              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => deleteMedication(i)}
                className="cursor-pointer"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsAdding((prev) => !prev);
          }}
        >
          {isAdding ? "Finish Adding" : "Show Form"}
        </Button>
        {isAdding && (
          <>
            <div className="mb-4 border-b pb-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Medication Name</FieldLabel>
                  <Input {...register(`medicationInput.name`)} />
                </Field>
                <Field>
                  <FieldLabel>Dosage</FieldLabel>
                  <Input {...register(`medicationInput.dosage`)} />
                </Field>
                <Field>
                  <FieldLabel>Frequency</FieldLabel>
                  <Input {...register(`medicationInput.frequency`)} />
                </Field>
                <Field>
                  <FieldLabel>Duration days</FieldLabel>
                  <Input
                    {...register(`medicationInput.durationDays`, {
                      valueAsNumber: true,
                    })}
                  />
                </Field>
                <Field className="col-span-2">
                  <FieldLabel>Instruction</FieldLabel>
                  <Textarea {...register(`medicationInput.instructions`)} />
                </Field>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                const values = getValues("medicationInput");

                const result = createRecordMedicationSchema.safeParse(values);

                if (!result.success) {
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
              }}
            >
              Add Medication
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

export default RecordMedicationForm;
