import api from "@/lib/api";

export async function handleGetCases({ patientId }: { patientId: string }) {
  const res = await api.get(`/api/case/${patientId}`);

  return res.data || [];
}
