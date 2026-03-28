import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import type { IRecordForm } from "@/types/RecordType";

function VitalSignsForm({ register }: IRecordForm) {
  return (
    <div className="h-full w-full">
      <Card className="h-fit w-full px-4 py-3">
        <p className="mb-2 text-xl font-semibold">Vital Signs</p>
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel>Blood Pressure Systolic</FieldLabel>
                <Input
                  className="border border-neutral-300"
                  type="number"
                  {...register("vitalSigns.bloodPressureSystolic", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel>Blood Pressure Diastolic</FieldLabel>
                <Input
                  className="border border-neutral-300"
                  type="number"
                  {...register("vitalSigns.bloodPressureDiastolic", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel>Temperature (Celcius)</FieldLabel>
                <Input
                  className="border border-neutral-300"
                  type="number"
                  {...register("vitalSigns.temperature", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field>
                <FieldLabel>Weight (kg)</FieldLabel>
                <Input
                  className="border border-neutral-300"
                  type="number"
                  {...register("vitalSigns.weightKg", { valueAsNumber: true })}
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </Card>
    </div>
  );
}

export default VitalSignsForm;
