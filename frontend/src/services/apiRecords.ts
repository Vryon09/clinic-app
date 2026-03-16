import api from "@/lib/api";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "@/schemas/recordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetRecords(id: string) {
  const res = await api.get(`/api/records/${id}`);

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
}: IHandleAddRecord) {
  const newRecord = { patientId, symptoms, diagnosis, signs };
  await api.post(`/api/records`, newRecord);
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
  const res = await api.delete(`/api/records/${recordId}`);

  console.log(res.data);
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
}: IHandleUpdateRecord) {
  const updatedRecordData = { symptoms, signs, diagnosis };

  const res = await api.patch(
    `/api/records/${consultationId}`,
    updatedRecordData,
  );

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
