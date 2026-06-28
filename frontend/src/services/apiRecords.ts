import api from "@/lib/api";
import type {
  CreateRecordInput,
  UpdateRecordInput,
} from "@/schemas/recordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export async function handleGetArchivedRecords({ page }: { page: number }) {
  const res = await api.get(`/api/records/archived?page=${page}&limit=10`);

  return res.data ?? [];
}

export interface IHandleAddRecord extends CreateRecordInput {
  patientId: string;
  caseId: string;
  createdById: string;
}

async function handleAddRecord({
  patientId,
  caseId,
  symptoms,
  diagnosis,
  signs,
  vitalSigns,
  recordMedications,
  createdById,
}: IHandleAddRecord) {
  const newRecord = {
    patientId,
    caseId,
    symptoms,
    diagnosis,
    signs,
    vitalSigns,
    recordMedications,
    createdById,
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
      toast.success("Created new record successfully", {
        position: "top-center",
      });
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

async function handleArchiveRecord(recordId: string) {
  await api.patch(`/api/records/${recordId}/archive`);
}

export function useArchiveRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleArchiveRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

async function handleRestoreRecord(id: string) {
  const res = await api.patch(`/api/records/${id}/restore`);

  console.log(res.data.message);
}

export function useRestoreRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRestoreRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["archivedRecords"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
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
  caseId,
}: IHandleUpdateRecord) {
  const visitDetails = { symptoms, signs, diagnosis, caseId };

  const res = await api.patch(`/api/records/${consultationId}/update`, {
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
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Updated record successfully", { position: "top-center" });
    },
  });
}
