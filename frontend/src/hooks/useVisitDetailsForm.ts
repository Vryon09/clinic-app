import {
  createRecordSchema,
  type CreateRecordInput,
} from "@/schemas/recordSchema";
import {
  handleGetRecord,
  type IHandleAddRecord,
  type IHandleUpdateRecord,
} from "@/services/apiRecords";
import type { IRecord } from "@/types/RecordType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, type UseMutateFunction } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { NavigateFunction } from "react-router";

interface IUseVisitDetailsForm {
  consultationId: string;
  patientId: string;
  formType: "edit" | "new";
  navigate: NavigateFunction;
  handleAddRecord: UseMutateFunction<void, Error, IHandleAddRecord, unknown>;
  handleUpdateRecord: UseMutateFunction<
    void,
    Error,
    IHandleUpdateRecord,
    unknown
  >;
}

export function useVisitDetailsForm({
  consultationId,
  patientId,
  formType,
  navigate,
  handleAddRecord,
  handleUpdateRecord,
}: IUseVisitDetailsForm) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      symptoms: "",
      signs: "",
      diagnosis: "",
      vitalSigns: {
        bloodPressureDiastolic: undefined,
        bloodPressureSystolic: undefined,
        temperature: undefined,
        weightKg: undefined,
      },
    },
  });

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
        vitalSigns: {
          bloodPressureDiastolic:
            record?.vitalSigns?.bloodPressureDiastolic || undefined,
          bloodPressureSystolic:
            record?.vitalSigns?.bloodPressureSystolic || undefined,
          temperature: record?.vitalSigns?.temperature || undefined,
          weightKg: record?.vitalSigns?.weightKg || undefined,
        },
      });
    }
  }, [record, reset, formType]);

  function onSubmit(recordData: CreateRecordInput) {
    if (formType === "new") {
      handleAddRecord({ ...recordData, patientId });
    } else {
      handleUpdateRecord({ ...recordData, consultationId });
    }

    navigate(`/patients/${patientId}`);
    reset();
  }

  return {
    handleSubmit,
    register,
    isRecordLoading,
    onSubmit,
  };
}
