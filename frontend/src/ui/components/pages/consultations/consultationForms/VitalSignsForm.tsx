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
import { Activity, AlertCircle, HeartPulse, Scale, Thermometer } from "lucide-react";
import { useWatch } from "react-hook-form";
import StatusBadge, { type StatusVariant } from "../../../common/StatusBadge";

// Clinical Blood Pressure classification (AHA/ACC)
function getBPStatus(systolic?: number, diastolic?: number): {
  label: string;
  variant: StatusVariant;
  hint: string;
} | null {
  if (!systolic && !diastolic) return null;
  if (!systolic || !diastolic) {
    return { label: "Incomplete BP", variant: "neutral", hint: "Enter both systolic & diastolic" };
  }
  if (systolic >= 180 || diastolic >= 120) {
    return { label: "Crisis", variant: "danger", hint: "Hypertensive Crisis (≥180/120)" };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { label: "Stage 2 HTN", variant: "danger", hint: "Stage 2 Hypertension (≥140/90)" };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { label: "Stage 1 HTN", variant: "warning", hint: "Stage 1 Hypertension (130-139/80-89)" };
  }
  if (systolic >= 120 && diastolic < 80) {
    return { label: "Elevated BP", variant: "warning", hint: "Elevated Blood Pressure (120-129/<80)" };
  }
  if (systolic >= 90 && diastolic >= 60) {
    return { label: "Normal BP", variant: "success", hint: "Optimal Blood Pressure (<120/80)" };
  }
  return { label: "Hypotension", variant: "info", hint: "Low Blood Pressure (<90/60)" };
}

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

  const systolic = vitalSignsValues?.bloodPressureSystolic;
  const diastolic = vitalSignsValues?.bloodPressureDiastolic;
  const temp = vitalSignsValues?.temperature;

  const bpStatus = getBPStatus(systolic, diastolic);
  const tempStatus = getTempStatus(temp);

  return (
    <Card className="h-fit w-full rounded-xl border border-border/80 bg-card shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Vital Signs
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Key physiological measurements & clinical alerts
            </p>
          </div>
        </div>

        {/* Live Clinical Summary Tag */}
        {bpStatus && (
          <StatusBadge variant={bpStatus.variant} dot={true} className="text-[11px]">
            {bpStatus.label}
          </StatusBadge>
        )}
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-2">
        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3.5">
              {/* Blood pressure systolic */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <HeartPulse className="size-3.5 text-primary" />
                    <span>Systolic</span>
                  </FieldLabel>
                  <span className="font-mono text-[10px] text-muted-foreground">mmHg</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm font-mono focus-visible:ring-1"
                    type="number"
                    placeholder="120"
                    {...register("vitalSigns.bloodPressureSystolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-muted-foreground">
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
                  <FieldLabel className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <HeartPulse className="size-3.5 text-primary" />
                    <span>Diastolic</span>
                  </FieldLabel>
                  <span className="font-mono text-[10px] text-muted-foreground">mmHg</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-12 text-sm font-mono focus-visible:ring-1"
                    type="number"
                    placeholder="80"
                    {...register("vitalSigns.bloodPressureDiastolic", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-muted-foreground">
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

              {/* BP Status Callout when entered */}
              {bpStatus && (
                <div className="col-span-2 flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <AlertCircle className="size-3.5 text-muted-foreground/70" />
                    {bpStatus.hint}
                  </span>
                  <span className="font-mono font-semibold text-foreground text-[11px]">
                    {systolic || "—"} / {diastolic || "—"} mmHg
                  </span>
                </div>
              )}

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
                    className="h-9 rounded-lg border-border/80 pr-10 text-sm font-mono focus-visible:ring-1"
                    type="number"
                    step="any"
                    placeholder="36.5"
                    {...register("vitalSigns.temperature", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
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
                  <span className="font-mono text-[10px] text-muted-foreground">Kilograms</span>
                </div>
                <div className="relative mt-1">
                  <Input
                    className="h-9 rounded-lg border-border/80 pr-10 text-sm font-mono focus-visible:ring-1"
                    step="any"
                    type="number"
                    placeholder="65"
                    {...register("vitalSigns.weightKg", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
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
