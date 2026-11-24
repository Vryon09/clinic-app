import api from "@/lib/api";
import type { DashboardRange, DashboardSummaryResponse } from "@/types/DashboardType";
import { useQuery } from "@tanstack/react-query";

export const handleGetDashboardSummary = async (
  range: DashboardRange = "30d"
): Promise<DashboardSummaryResponse> => {
  const res = await api.get("/api/dashboard/summary", {
    params: { range },
  });
  return res.data;
};

export const useDashboardSummary = (range: DashboardRange = "30d") => {
  return useQuery<DashboardSummaryResponse>({
    queryKey: ["dashboard-summary", range],
    queryFn: () => handleGetDashboardSummary(range),
    staleTime: 1000 * 60, // 1 minute
  });
};
