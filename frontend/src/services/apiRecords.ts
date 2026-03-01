import api from "@/lib/api";
import type { CreateRecordInput } from "@/schemas/recordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetRecords(id: string) {
  const res = await api.get(`/api/records/${id}`);

  return res.data || [];
}

interface IHandleAddRecord extends CreateRecordInput {
  patientId: string;
}

async function handleAddRecord({
  patientId,
  chiefComplaint,
  diagnosis,
  notes,
}: IHandleAddRecord) {
  const newRecord = { patientId, chiefComplaint, diagnosis, notes };
  const res = await api.post(`/api/records`, newRecord);

  return res.data || {};
}

export function useAddRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}
