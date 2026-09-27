import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

async function handleBackup(payload?: { password?: string }) {
  await api.post("/api/backup/drive", {
    password: payload?.password || undefined,
  });
}

export function useBackup() {
  return useMutation<
    unknown,
    AxiosError<{ error?: string; message?: string }>,
    { password?: string } | void
  >({
    mutationFn: () => handleBackup(),
    onSuccess: () => {
      toast.success("Encrypted backup uploaded to Google Drive successfully!", {
        position: "top-center",
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create backup.";
      toast.error(errorMessage, { position: "top-center" });
    },
  });
}

async function handleImportBackup({
  file,
  password,
}: {
  file: File;
  password?: string;
}) {
  const formData = new FormData();
  formData.append("backup", file);
  if (password) {
    formData.append("password", password);
  }

  const res = await api.post("/api/backup/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export function useImportBackup() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    AxiosError<{ error?: string; message?: string }>,
    { file: File; password?: string }
  >({
    mutationFn: handleImportBackup,
    onSuccess: () => {
      toast.success("Backup imported successfully!", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to import backup.";
      toast.error(errorMessage, { position: "top-center" });
    },
  });
}

async function handleRestoreBackup({
  file,
  password,
}: {
  file: File;
  password?: string;
}) {
  const formData = new FormData();
  formData.append("backup", file);
  if (password) {
    formData.append("password", password);
  }

  const res = await api.post("/api/backup/restore", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    AxiosError<{ error?: string; message?: string }>,
    { file: File; password?: string }
  >({
    mutationFn: handleRestoreBackup,
    onSuccess: () => {
      toast.success("Backup restored successfully!", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to restore backup.";
      toast.error(errorMessage, { position: "top-center" });
    },
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
