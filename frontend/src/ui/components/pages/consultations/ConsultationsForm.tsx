import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Textarea } from "../../shadcn/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRecordSchema,
  type CreateRecordInput,
} from "@/schemas/recordSchema";
import { Button } from "../../shadcn/button";
import { useAddRecord } from "@/services/apiRecords";

function ConsultationsForm() {
  const { id } = useParams() as { id: string };

  const { data: patient, isPending } = useQuery({
    queryFn: () => handleGetPatient({ id }),
    queryKey: ["patient", id],
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(createRecordSchema),
  });

  const { mutate: handleAddRecord } = useAddRecord();

  function onSubmit(newRecord: CreateRecordInput) {
    handleAddRecord({ ...newRecord, patientId: id });
    reset();
  }

  if (isPending) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <p>New Consultation</p>
        <p>
          Patient:{" "}
          {`${patient.lastName}, ${patient.firstName}${patient.middleName ? ` ${patient.middleName.slice(0, 1)}.` : ""}`}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Chief Complaint</FieldLabel>
                <Input type="text" {...register("chiefComplaint")} />
              </Field>

              <Field>
                <FieldLabel>Diagnosis</FieldLabel>
                <Textarea {...register("diagnosis")} />
              </Field>

              <Field>
                <FieldLabel>Notes</FieldLabel>
                <Textarea {...register("notes")} />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
}

export default ConsultationsForm;
