import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../../shadcn/field";
import { Textarea } from "../../../shadcn/textarea";
import type { IRecordForm } from "@/types/RecordType";

function VisitDetailsForm({ register }: IRecordForm) {
  return (
    <Card className="w-full rounded-xl border border-border/80">
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Visit Details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <FieldSet>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Symptoms
              </FieldLabel>
              <Textarea
                placeholder="Describe patient's symptoms…"
                className="min-h-[80px] resize-none rounded-lg border-border/80 text-sm focus-visible:ring-1"
                {...register("symptoms")}
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Signs
              </FieldLabel>
              <Textarea
                placeholder="Observed clinical signs…"
                className="min-h-[80px] resize-none rounded-lg border-border/80 text-sm focus-visible:ring-1"
                {...register("signs")}
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Diagnosis
              </FieldLabel>
              <Textarea
                placeholder="Clinical diagnosis…"
                className="min-h-[80px] resize-none rounded-lg border-border/80 text-sm focus-visible:ring-1"
                {...register("diagnosis")}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}

export default VisitDetailsForm;
