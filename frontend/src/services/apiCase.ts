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
    onSuccess: (_data, variables) => {
      toast.success("Case Folder Created", {
        description: `Case "${variables.caseName}" has been opened for this patient.`,
      });
      queryClient.invalidateQueries({ queryKey: ["cases", patientId] });
    },
    onError: (error: any) => {
      toast.error("Failed to Create Case", {
        description:
          error?.response?.data?.message || "Could not create new case folder.",
      });
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
    onSuccess: (_data, variables) => {
      toast.success("Case Folder Updated", {
        description: `Case "${variables.caseName}" details and physician assignment updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["cases", patientId] });
    },
    onError: (error: any) => {
      toast.error("Failed to Update Case", {
        description:
          error?.response?.data?.message || "Could not update case folder.",
      });
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
      toast.success("Case Archived", {
        description:
          "Case folder and its consultations moved to Archive. Restore anytime from Settings > Archive.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Archive Case", {
        description:
          error?.response?.data?.message || "Could not archive case folder.",
      });
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
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["archivedCases"] });
      toast.success("Case Restored", {
        description:
          "Case folder and its consultations restored to active cases.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Restore Case", {
        description:
          error?.response?.data?.message || "Could not restore case folder.",
      });
    },
  });
}
