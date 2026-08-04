import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function handleBackup() {
  await api.post("/api/backup/drive");
}

export function useBackup() {
  return useMutation({
    mutationFn: handleBackup,
  });
}

async function handleRestoreBackup({ file }: { file: File }) {
  const formData = new FormData();
  formData.append("backup", file);

  const res = await api.post("/api/backup/restore", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res.data);
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleRestoreBackup,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["authStatus"] }),
  });
}

export async function handleGetGoogleAuthData() {
  const res = await api.get("/api/google/data");

  return res || {};
}

async function logout() {
  await api.delete("/api/google");
}

export function useHandleLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["google-status"] }),
  });
}
