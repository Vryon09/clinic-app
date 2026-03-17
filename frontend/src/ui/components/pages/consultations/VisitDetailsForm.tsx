import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";
import type { IRecordForm } from "@/types/RecordType";

function VisitDetailsForm({ register }: IRecordForm) {
  return (
    <Card className="w-full px-4 py-2">
      <p>Visit Details</p>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Symptoms</FieldLabel>
            <Textarea {...register("symptoms")} />
          </Field>

          <Field>
            <FieldLabel>Signs</FieldLabel>
            <Textarea {...register("signs")} />
          </Field>

          <Field>
            <FieldLabel>Diagnosis</FieldLabel>
            <Textarea {...register("diagnosis")} />
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}

export default VisitDetailsForm;
