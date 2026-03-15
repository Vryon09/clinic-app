import { handleGetPatient } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRecordSchema,
  type CreateRecordInput,
} from "@/schemas/recordSchema";
import { Button } from "../../shadcn/button";
import {
  handleGetRecord,
  useAddRecord,
  useUpdateRecord,
} from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { useEffect } from "react";

function ConsultationsForm() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const location = useLocation();
  const pathName = location.pathname.split("/");
  const formType = pathName.at(-1);

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
      symptoms: "",
      signs: "",
      diagnosis: "",
    },
  });

  useEffect(() => {
    if (formType === "edit") {
      reset({
        symptoms: record?.symptoms || "",
        signs: record?.signs || "",
        diagnosis: record?.diagnosis || "",
      });
    }
  }, [record, reset, formType]);

  const { mutate: handleAddRecord } = useAddRecord();
  const { mutate: handleUpdateRecord } = useUpdateRecord();

  const navigate = useNavigate();

  function onSubmit(recordData: CreateRecordInput) {
    if (formType === "new") {
      handleAddRecord({ ...recordData, patientId });
    } else {
      handleUpdateRecord({ ...recordData, consultationId });
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
          <Button disabled={isPatientLoading || isRecordLoading} type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ConsultationsForm;
