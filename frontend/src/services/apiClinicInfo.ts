import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetClinicInfo() {
  const res = await api.get("/api/clinicInfo");

  return res.data || {};
}

async function handleInitClinicInfo() {
  const res = await api.post("/api/clinicInfo/init");

  return res.data || {};
}

export function useInitClinicInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleInitClinicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
    },
  });
}
