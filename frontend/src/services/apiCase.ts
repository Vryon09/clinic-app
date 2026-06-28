import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export async function handleGetCases({ patientId }: { patientId: string }) {
  const res = await api.get(`/api/case/${patientId}`);

  return res.data || [];
}

async function handleAddCase({
  patientId,
  caseName,
  doctorId,
}: {
  patientId: string;
  caseName: string;
  doctorId: string;
}) {
  const res = await api.post(`/api/case/${patientId}`, { caseName, doctorId });

  return res.data || [];
}

export function useAddCase(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleAddCase,
    onSuccess: () => {
      toast.success("Case successfully created.", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["cases", patientId] });
    },
  });
}
