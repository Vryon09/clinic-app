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
import { Scale, Thermometer } from "lucide-react";
import { useWatch } from "react-hook-form";
import StatusBadge, { type StatusVariant } from "../../../common/StatusBadge";

// Temperature classification (°C)
function getTempStatus(temp?: number): {
  label: string;
  variant: StatusVariant;
} | null {
  if (!temp || isNaN(temp)) return null;
  if (temp >= 39.0) return { label: "High Fever", variant: "danger" };
  if (temp >= 38.0) return { label: "Fever / Febrile", variant: "warning" };
  if (temp >= 37.5) return { label: "Low-grade Fever", variant: "warning" };
  if (temp >= 36.0) return { label: "Normal", variant: "success" };
  return { label: "Hypothermic (<36°C)", variant: "info" };
}

function VitalSignsForm({ register, errors, control }: IVitalSignsForm) {
  const vitalSignsValues = useWatch({
    control,
    name: "vitalSigns",
  });

  const temp = vitalSignsValues?.temperature;
  const tempStatus = getTempStatus(temp);

  return (
    <Card className="h-fit w-full rounded-xl border border-border/80 bg-card shadow-2xs">
      <CardHeader className="pb-2 pt-4 px-5">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">
            Vital Signs
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Key physiological measurements & clinical alerts
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-2">
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3.5">
              {/* Blood pressure systolic */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-medium text-muted-foreground">
                    <span>Systolic</span>
                  </FieldLabel>
                  <span className="text-[10px] text-muted-foreground">mmHg</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm focus-visible:ring-1"
                    type="number"
                    placeholder="120"
                    {...register("vitalSigns.bloodPressureSystolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                    SYS
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
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-medium text-muted-foreground">
                    <span>Diastolic</span>
                  </FieldLabel>
                  <span className="text-[10px] text-muted-foreground">mmHg</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm focus-visible:ring-1"
                    type="number"
                    placeholder="80"
                    {...register("vitalSigns.bloodPressureDiastolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                    DIA
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
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Thermometer className="size-3.5 text-primary" />
                    <span>Temperature</span>
                  </FieldLabel>
                  {tempStatus && (
                    <StatusBadge variant={tempStatus.variant} dot={false} className="px-1.5 py-0 text-[10px]">
                      {tempStatus.label}
                    </StatusBadge>
                  )}
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-10 text-sm focus-visible:ring-1"
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
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Scale className="size-3.5 text-primary" />
                    <span>Body Weight</span>
                  </FieldLabel>
                  <span className="text-[10px] text-muted-foreground">Kilograms</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-10 text-sm focus-visible:ring-1"
                    step="any"
                    type="number"
                    placeholder="65"
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
