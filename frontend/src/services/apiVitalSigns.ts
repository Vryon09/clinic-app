import api from "@/lib/api";
import type { CreateVitalSignsInput } from "@/schemas/vitalSignsSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function handleAddVitalSigns({
  recordId,
  bloodPressureDiastolic,
  bloodPressureSystolic,
  temperature,
  weightKg,
}: CreateVitalSignsInput) {
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

export function useAddVitalSigns(recordId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddVitalSigns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitalSign", recordId] });
      queryClient.invalidateQueries({ queryKey: ["record", recordId] });
    },
  });
}
