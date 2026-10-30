import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../../shadcn/field";
import { Textarea } from "../../../shadcn/textarea";
import type { IRecordForm } from "@/types/RecordType";
import { Sparkles, Stethoscope } from "lucide-react";

const SYMPTOM_PRESETS = [
  "Fever & chills",
  "Productive cough",
  "Dry cough",
  "Headache",
  "Sore throat",
  "Abdominal pain",
  "Body malaise & fatigue",
  "Dizziness",
];

const SIGN_PRESETS = [
  "Clear breath sounds bilaterally",
  "Normal heart rate & regular rhythm",
  "Abdomen soft, non-tender",
  "No pedal edema",
  "Pharynx non-hyperemic",
  "No lymphadenopathy",
];

const DIAGNOSIS_PRESETS = [
  "Upper Respiratory Tract Infection (URTI)",
  "Acute Viral Illness",
  "Hypertension, Essential (Follow-up)",
  "Acute Gastroenteritis",
  "Type 2 Diabetes Mellitus (Routine check)",
  "Tension-type Headache",
];

function VisitDetailsForm({ register, setValue, getValues }: IRecordForm) {
  const appendValue = (
    field: "symptoms" | "signs" | "diagnosis",
    chipText: string,
  ) => {
    if (!setValue || !getValues) return;
    const current = (getValues(field) || "").trim();
    if (!current) {
      setValue(field, chipText, { shouldValidate: true, shouldDirty: true });
    } else if (!current.toLowerCase().includes(chipText.toLowerCase())) {
      setValue(field, `${current}; ${chipText}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <Card className="w-full rounded-xl border border-border/80 bg-card shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Stethoscope className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              SOAP Clinical Documentation
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Subjective history, objective physical signs, and clinical assessment
            </p>
          </div>
        </div>

        <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground font-medium">
          EMR SOAP Format
        </span>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-4">
        <FieldSet>
          <FieldGroup className="gap-5">
            {/* S - Subjective: Symptoms */}
            <Field className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded bg-primary/15 font-mono text-[10px] font-bold text-primary">
                    S
                  </span>
                  <span>Subjective &mdash; Chief Complaints &amp; Symptoms</span>
                </FieldLabel>
                <span className="font-mono text-[10px] text-muted-foreground">History</span>
              </div>

              <Textarea
                placeholder="Patient's stated symptoms, onset, duration, and severity..."
                className="min-h-[75px] resize-none rounded-lg border-border/80 bg-background text-xs leading-relaxed focus-visible:ring-1"
                {...register("symptoms")}
              />

              {/* Symptom chips */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <Sparkles className="size-3 text-primary/70" /> Quick Add:
                </span>
                {SYMPTOM_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => appendValue("symptoms", preset)}
                    className="cursor-pointer rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </Field>

            {/* O - Objective: Physical Signs */}
            <Field className="space-y-1.5 border-t border-border/40 pt-4">
              <div className="flex items-center justify-between">
                <FieldLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded bg-primary/15 font-mono text-[10px] font-bold text-primary">
                    O
                  </span>
                  <span>Objective &mdash; Physical Examination &amp; Signs</span>
                </FieldLabel>
                <span className="font-mono text-[10px] text-muted-foreground">Physical Exam</span>
              </div>

              <Textarea
                placeholder="Clinician physical exam observations, auscultation, inspection..."
                className="min-h-[75px] resize-none rounded-lg border-border/80 bg-background text-xs leading-relaxed focus-visible:ring-1"
                {...register("signs")}
              />

              {/* Signs chips */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <Sparkles className="size-3 text-primary/70" /> Normal Findings:
                </span>
                {SIGN_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => appendValue("signs", preset)}
                    className="cursor-pointer rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </Field>

            {/* A - Assessment: Diagnosis */}
            <Field className="space-y-1.5 border-t border-border/40 pt-4">
              <div className="flex items-center justify-between">
                <FieldLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded bg-primary/15 font-mono text-[10px] font-bold text-primary">
                    A
                  </span>
                  <span>Assessment &mdash; Primary Clinical Diagnosis</span>
                </FieldLabel>
                <span className="font-mono text-[10px] text-muted-foreground">Diagnosis</span>
              </div>

              <Textarea
                placeholder="Working diagnosis, differential impressions, or confirmed ICD condition..."
                className="min-h-[75px] resize-none rounded-lg border-border/80 bg-background text-xs leading-relaxed focus-visible:ring-1"
                {...register("diagnosis")}
              />

              {/* Diagnosis chips */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <Sparkles className="size-3 text-primary/70" /> Common Conditions:
                </span>
                {DIAGNOSIS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => appendValue("diagnosis", preset)}
                    className="cursor-pointer rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}

export default VisitDetailsForm;
