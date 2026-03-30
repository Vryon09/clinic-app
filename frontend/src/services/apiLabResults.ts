import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["labResults"] }),
  });
}
