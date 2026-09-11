import type { IVitalSignsForm } from "@/types/RecordType";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shadcn/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../../shadcn/field";
import { Input } from "../../../shadcn/input";

function VitalSignsForm({ register, errors }: IVitalSignsForm) {
  return (
    <Card className="h-fit w-full rounded-xl border border-border/80">
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              {/* Blood pressure systolic */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Systolic{" "}
                  <span className="text-muted-foreground/60">(mmHg)</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm"
                    type="number"
                    placeholder="120"
                    {...register("vitalSigns.bloodPressureSystolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    mmHg
                  </span>
                </div>
                {errors.vitalSigns?.bloodPressureSystolic && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.bloodPressureSystolic]}
                  />
                )}
              </Field>

              {/* Blood pressure diastolic */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Diastolic{" "}
                  <span className="text-muted-foreground/60">(mmHg)</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm"
                    type="number"
                    placeholder="80"
                    {...register("vitalSigns.bloodPressureDiastolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    mmHg
                  </span>
                </div>
                {errors.vitalSigns?.bloodPressureDiastolic && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.bloodPressureDiastolic]}
                  />
                )}
              </Field>

              {/* Temperature */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Temperature{" "}
                  <span className="text-muted-foreground/60">(°C)</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-8 text-sm"
                    type="number"
                    step="any"
                    placeholder="36.5"
                    {...register("vitalSigns.temperature", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    °C
                  </span>
                </div>
                {errors.vitalSigns?.temperature && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.vitalSigns.temperature]}
                  />
                )}
              </Field>

              {/* Weight */}
              <Field>
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Weight{" "}
                  <span className="text-muted-foreground/60">(kg)</span>
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-8 text-sm"
                    step="any"
                    type="number"
                    placeholder="60"
                    {...register("vitalSigns.weightKg", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    kg
                  </span>
                </div>
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
      </CardContent>
    </Card>
  );
}

export default VitalSignsForm;
