import api from "@/lib/api";

export async function handleGetRecordMedications(recordId: string) {
  const res = await api.get(`/api/recordMedication/${recordId}`);

  return res.data || [];
}
