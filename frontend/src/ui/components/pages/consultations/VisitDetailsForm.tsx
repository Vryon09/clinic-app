import { useForm } from "react-hook-form";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRecordSchema,
  type CreateRecordInput,
} from "@/schemas/recordSchema";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { IRecord } from "@/types/RecordType";
import {
  handleGetRecord,
  useAddRecord,
  useUpdateRecord,
} from "@/services/apiRecords";

function VisitDetailsForm() {
  const { patientId, consultationId } = useParams() as {
    patientId: string;
    consultationId: string;
  };

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      symptoms: "",
      signs: "",
      diagnosis: "",
    },
  });

  const location = useLocation();
  const pathName = location.pathname.split("/");
  const formType = pathName.at(-1);

  const { data: record, isPending: isRecordLoading } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
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

  return (
    <Card className="w-full px-4 py-2">
      <p>Visit Details</p>
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
        <Button disabled={isRecordLoading} type="submit">
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default VisitDetailsForm;
