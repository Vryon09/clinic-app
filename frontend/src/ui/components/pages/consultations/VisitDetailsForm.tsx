import type { UseFormRegister } from "react-hook-form";
import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";

interface IVisitDetailsForm {
  register: UseFormRegister<{
    symptoms?: string | undefined;
    signs?: string | undefined;
    diagnosis?: string | undefined;
    vitalSigns?:
      | {
          recordId: string;
          bloodPressureSystolic?: number | undefined;
          bloodPressureDiastolic?: number | undefined;
          temperature?: number | undefined;
          weightKg?: number | undefined;
        }
      | undefined;
  }>;
}

function VisitDetailsForm({ register }: IVisitDetailsForm) {
  return (
    <Card className="w-full px-4 py-2">
      <p>Visit Details</p>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
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
      {/* <Button disabled={isRecordLoading} type="submit">
          Submit
        </Button> */}
      {/* </form> */}
    </Card>
  );
}

export default VisitDetailsForm;
