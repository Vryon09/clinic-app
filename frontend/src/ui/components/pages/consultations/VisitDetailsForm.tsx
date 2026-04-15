import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";
import type { IRecordForm } from "@/types/RecordType";

function VisitDetailsForm({ register }: IRecordForm) {
  return (
    <Card className="w-full px-4 py-3">
      <p className="mb-2 text-xl font-semibold">Visit Details</p>
      <FieldSet>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Symptoms</FieldLabel>
            <Textarea
              className="border border-neutral-300"
              {...register("symptoms")}
            />
          </Field>

          <Field>
            <FieldLabel>Signs</FieldLabel>
            <Textarea
              className="border border-neutral-300"
              {...register("signs")}
            />
          </Field>

          <Field>
            <FieldLabel>Diagnosis</FieldLabel>
            <Textarea
              className="border border-neutral-300"
              {...register("diagnosis")}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}

export default VisitDetailsForm;
