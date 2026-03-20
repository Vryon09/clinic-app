import type { IRecordForm } from "@/types/RecordType";
import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Textarea } from "../../shadcn/textarea";

function RecordMedicationForm({ register }: IRecordForm) {
  return (
    <Card className="col-span-2">
      <p>Record Medication</p>
      <FieldSet>
        <FieldGroup>
          <div>
            <Field>
              <FieldLabel>Medication Name</FieldLabel>
              <Input type="text" {...register("recordMedication.name")} />
            </Field>
            <Field>
              <FieldLabel>Dosage</FieldLabel>
              <Input type="text" {...register("recordMedication.dosage")} />
            </Field>
            <Field>
              <FieldLabel>Frequency</FieldLabel>
              <Input type="text" {...register("recordMedication.frequency")} />
            </Field>
            <Field>
              <FieldLabel>Duration days</FieldLabel>
              <Input
                type="number"
                {...register("recordMedication.durationDays", {
                  valueAsNumber: true,
                })}
              />
            </Field>
            <Field>
              <FieldLabel>Instruction</FieldLabel>
              <Textarea {...register("recordMedication.instructions")} />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}

export default RecordMedicationForm;
