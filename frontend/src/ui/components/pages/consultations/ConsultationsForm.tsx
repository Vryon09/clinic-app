import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
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
import { handleGetRecord, useAddRecord } from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useEffect } from "react";

function ConsultationsForm() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { data: patient, isPending: isPatientLoading } = useQuery({
    queryFn: () => handleGetPatient({ id: patientId }),
    queryKey: ["patient", patientId],
  });

  const { data: record, isPending: isRecordLoading } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      chiefComplaint: "",
      diagnosis: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (record?.chiefComplaint !== "") {
      reset({
        chiefComplaint: record?.chiefComplaint || "",
        diagnosis: record?.diagnosis || "",
        notes: record?.notes || "",
      });
    }
  }, [record, reset]);

  const { mutate: handleAddRecord } = useAddRecord();

  const navigate = useNavigate();

  function onSubmit(newRecord: CreateRecordInput) {
    if (!record?.chiefComplaint) {
      handleAddRecord({ ...newRecord, patientId });
    }

    navigate(`/patients/${patientId}`);
    reset();
  }

  if (isPatientLoading || isRecordLoading) return <p>Loading...</p>;

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
          <Button disabled={isPatientLoading || isRecordLoading} type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ConsultationsForm;
