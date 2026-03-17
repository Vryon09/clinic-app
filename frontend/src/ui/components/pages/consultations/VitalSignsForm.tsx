import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import type { IRecordForm } from "@/types/RecordType";

function VitalSignsForm({ register }: IRecordForm) {
  return (
    <Card className="w-full px-4 py-2">
      <p>Vital Signs</p>
      <FieldSet>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel>bloodPressureSystolic</FieldLabel>
              <Input
                type="number"
                {...register("vitalSigns.bloodPressureSystolic", {
                  valueAsNumber: true,
                })}
              />
            </Field>

            <Field>
              <FieldLabel>bloodPressureDiastolic</FieldLabel>
              <Input
                type="number"
                {...register("vitalSigns.bloodPressureDiastolic", {
                  valueAsNumber: true,
                })}
              />
            </Field>

            <Field>
              <FieldLabel>temperature</FieldLabel>
              <Input
                type="number"
                {...register("vitalSigns.temperature", { valueAsNumber: true })}
              />
            </Field>

            <Field>
              <FieldLabel>weightKg</FieldLabel>
              <Input
                type="number"
                {...register("vitalSigns.weightKg", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}

export default VitalSignsForm;
