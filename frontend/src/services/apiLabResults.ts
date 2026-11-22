import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export async function handeGetLabResults({
  patientId,
  page,
}: {
  patientId: string;
  page: number;
}) {
  const res = await api.get(
    `/api/labResults/${patientId}?page=${page}&limit=10`,
  );

  return res.data || [];
}

export async function handleGetLabResultFile(id: string): Promise<Blob> {
  const res = await api.get(`/api/labResults/${id}/file`, {
    responseType: "blob",
  });
  return res.data;
}

async function handleUploadLabResult({
  patientId,
  file,
}: {
  patientId: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("file", file);

  const res = await api.post("/api/labResults/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res.data);
}

export function useUploadLabResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleUploadLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labResults"] });
      toast.success("Lab Result Attached", {
        description:
          "Laboratory test document uploaded to patient record.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Upload Lab Result", {
        description:
          error?.response?.data?.message ||
          "Could not upload laboratory test file.",
      });
    },
  });
}

async function handleDeleteLabResult(id: string) {
  await api.delete(`/api/labResults/${id}`);
}

export function useDeleteLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labResults"] });
      toast.success("Lab Result Removed", {
        description: "The laboratory file was removed from the patient record.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Remove Lab Result", {
        description:
          error?.response?.data?.message ||
          "Could not remove laboratory file.",
      });
    },
  });
}
