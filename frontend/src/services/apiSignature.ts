import api from "@/lib/api";
import type { ErrorResponse } from "@/types/ErrorType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export async function handleGetSignature() {
  const res = await api.get("/api/signature/");

  console.log(res);
  return res.data || {};
}

async function handleUploadSignature({ file }: { file: File }) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/signature/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res);
}

export function useUploadSignature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleUploadSignature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signature"] });
      toast.success("Upload Signature successfully", {
        position: "top-center",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(`${error.response?.data.message}`, {
        position: "top-center",
      });
    },
  });
}
