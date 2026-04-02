import {
  createRecordSchema,
  type CreateRecordInput,
} from "@/schemas/recordSchema";
import { handleGetRecordMedications } from "@/services/apiRecordMedications";
import {
  handleGetRecord,
  type IHandleAddRecord,
  type IHandleUpdateRecord,
} from "@/services/apiRecords";
import { handleGetVitalSigns } from "@/services/apiVitalSigns";
import type { IRecordMedications } from "@/types/RecordMedications";
import type { IRecord } from "@/types/RecordType";
import type { IVitalSigns } from "@/types/VitalSignsType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, type UseMutateFunction } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
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

      medicationInput: {
        name: "",
        dosage: "",
        frequency: "",
        durationDays: 0,
        instructions: "",
      },

      recordMedications: [],
    },
  });

  // console.log(errors);

  const {
    fields: recordMedicationField,
    append: addMedication,
    remove: deleteMedication,
  } = useFieldArray({
    control,
    name: "recordMedications",
  });

  const { data: record, isPending: isRecordLoading } = useQuery<IRecord>({
    queryFn: () => handleGetRecord(consultationId),
    queryKey: ["record", consultationId],
  });

  const { data: recordMedications } = useQuery<IRecordMedications[]>({
    queryFn: () => handleGetRecordMedications(consultationId),
    queryKey: ["recordMedications", consultationId],
  });

  const { data: vitalSigns } = useQuery<IVitalSigns>({
    queryFn: () => handleGetVitalSigns(consultationId),
    queryKey: ["vitalSign", consultationId],
  });

  useEffect(() => {
    if (formType === "edit") {
      reset({
        symptoms: record?.symptoms || "",
        signs: record?.signs || "",
        diagnosis: record?.diagnosis || "",
        vitalSigns: {
          bloodPressureDiastolic:
            vitalSigns?.bloodPressureDiastolic || undefined,
          bloodPressureSystolic: vitalSigns?.bloodPressureSystolic || undefined,
          temperature: vitalSigns?.temperature || undefined,
          weightKg: vitalSigns?.weightKg || undefined,
        },
        recordMedications: recordMedications || [],
        medicationInput: {
          name: "",
          dosage: "",
          frequency: "",
          durationDays: 0,
          instructions: "",
        },
      });
    }
  }, [record, reset, formType, vitalSigns, recordMedications]);

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
    recordMedicationField,
    addMedication,
    deleteMedication,
    getValues,
    setValue,
    errors,
    setError,
  };
}
