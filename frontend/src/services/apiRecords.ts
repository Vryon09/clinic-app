import type { CreateRecordInput } from "@/schemas/recordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function handleAddRecord({
  patientId,
  chiefComplaint,
  diagnosis,
  notes,
}: CreateRecordInput) {
  const newRecord = { patientId, chiefComplaint, diagnosis, notes };
  const res = await axios.post(`http://localhost:3000/api/records`, newRecord);

  return res.data || {};
}

export function useAddRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}
