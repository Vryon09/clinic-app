import api from "@/lib/api";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "@/schemas/recordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetRecords({
  id,
  page,
}: {
  id: string;
  page: number;
}) {
  const res = await api.get(`/api/records/${id}?page=${page}&limit=10`);

  return res.data || [];
}

export async function handleGetRecord(id: string) {
  const res = await api.get(`/api/records/${id}/record`);

  return res.data || {};
}

export interface IHandleAddRecord extends CreateRecordInput {
  patientId: string;
}

async function handleAddRecord({
  patientId,
  symptoms,
  diagnosis,
  signs,
  vitalSigns,
  recordMedications,
}: IHandleAddRecord) {
  const newRecord = {
    patientId,
    symptoms,
    diagnosis,
    signs,
    vitalSigns,
    recordMedications,
  };
  const res = await api.post(`/api/records`, newRecord);

  return res.data || {};
}

export function useAddRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

async function handleDeleteRecord(recordId: string) {
  await api.delete(`/api/records/${recordId}`);
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteRecord,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

export interface IHandleUpdateRecord extends UpdateRecordInput {
  consultationId: string;
}

async function handleUpdateRecord({
  consultationId,
  symptoms,
  signs,
  diagnosis,
  vitalSigns,
  recordMedications,
}: IHandleUpdateRecord) {
  const visitDetails = { symptoms, signs, diagnosis };

  const res = await api.patch(`/api/records/${consultationId}`, {
    ...visitDetails,
    vitalSigns,
    recordMedications,
  });

  console.log(res.data);
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateRecord,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}
