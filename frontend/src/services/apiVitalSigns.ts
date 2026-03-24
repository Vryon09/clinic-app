import api from "@/lib/api";
import type { CreateVitalSignsInput } from "@/schemas/vitalSignsSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IHandleAddVitalSigns extends CreateVitalSignsInput {
  recordId: string;
}

async function handleAddVitalSigns({
  recordId,
  bloodPressureDiastolic,
  bloodPressureSystolic,
  temperature,
  weightKg,
}: IHandleAddVitalSigns) {
  const newVitalSigns = {
    recordId,
    bloodPressureDiastolic,
    bloodPressureSystolic,
    temperature,
    weightKg,
  };
  const res = await api.post("/api/vitalSigns/", newVitalSigns);

  console.log(res.data);
}

export function useAddVitalSigns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddVitalSigns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitalSign"] });
      queryClient.invalidateQueries({ queryKey: ["record"] });
    },
  });
}

export async function handleGetVitalSigns(recordId: string) {
  const res = await api.get(`/api/vitalSigns/${recordId}`);

  return res.data || {};
}
