import type { IVitalSignsForm } from "@/types/RecordType";
import { Card } from "../../shadcn/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../shadcn/field";
import { Input } from "../../shadcn/input";

function VitalSignsForm({ register, errors }: IVitalSignsForm) {
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
                {errors.vitalSigns?.bloodPressureSystolic && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.bloodPressureSystolic]}
                  />
                )}
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
                {errors.vitalSigns?.bloodPressureDiastolic && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.bloodPressureDiastolic]}
                  />
                )}
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
                {errors.vitalSigns?.temperature && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.temperature]}
                  />
                )}
              </Field>

              <Field>
                <FieldLabel>Weight (kg)</FieldLabel>
                <Input
                  className="border border-neutral-300"
                  step="any"
                  type="number"
                  {...register("vitalSigns.weightKg", { valueAsNumber: true })}
                />
                {errors.vitalSigns?.weightKg && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.weightKg]}
                  />
                )}
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </Card>
    </div>
  );
}

export default VitalSignsForm;
