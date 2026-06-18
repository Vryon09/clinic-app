import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetCases({ patientId }: { patientId: string }) {
  const res = await api.get(`/api/case/${patientId}`);

  return res.data || [];
}

async function handleAddCase({
  patientId,
  caseName,
}: {
  patientId: string;
  caseName: string;
}) {
  const res = await api.post(`/api/case/${patientId}`, { caseName });

  return res.data || [];
}

export function useAddCase(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleAddCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases", patientId] });
    },
  });
}
