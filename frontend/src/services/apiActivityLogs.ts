import api from "@/lib/api";

export async function handleGetActivityLogs() {
  const res = await api.get("/api/activityLog");

  return res.data || [];
}
