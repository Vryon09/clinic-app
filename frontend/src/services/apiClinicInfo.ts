import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

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

async function handleUpdateClinicInfo({
  name,
  address,
  phone,
}: {
  name: string;
  address: string;
  phone: string;
}) {
  const res = await api.patch("/api/clinicInfo/update", {
    name,
    address,
    phone,
  });

  return res.data || {};
}

export function useUpdateClinicInfo() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      name: string;
      address: string;
      phone: string;
    }
  >({
    mutationFn: handleUpdateClinicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
    },
  });
}
