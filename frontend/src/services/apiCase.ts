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

async function handleUpdateCase({
  patientId,
  caseName,
  doctorId,
  caseId,
}: {
  patientId: string;
  caseName: string;
  doctorId: string;
  caseId: string;
}) {
  const res = await api.patch(`/api/case/${patientId}/${caseId}`, {
    caseName,
    doctorId,
  });

  return res.data || [];
}

export function useUpdateCase(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateCase,
    onSuccess: () => {
      toast.success("Case successfully updated.", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["cases", patientId] });
    },
  });
}

async function handleArchiveCase(caseId: string) {
  await api.patch(`/api/case/${caseId}/archive`);
}

export function useArchiveCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleArchiveCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

export async function handleGetArchivedCases({ page }: { page: number }) {
  const res = await api.get(`/api/case/archived?page=${page}&limit=10`);

  return res.data ?? [];
}

async function handleRestoreCase(id: string) {
  const res = await api.patch(`/api/case/${id}/restore`);

  console.log(res.data.message);
}

export function useRestoreCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRestoreCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedCases"] });
    },
  });
}
