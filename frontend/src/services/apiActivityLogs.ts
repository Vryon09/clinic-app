import api from "@/lib/api";

export async function handleGetActivityLogs({ page }: { page: number }) {
  const res = await api.get(`/api/activityLog?page=${page}&limit=10`);

  return res.data || [];
}
