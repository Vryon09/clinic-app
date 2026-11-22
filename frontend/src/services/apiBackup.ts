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
      toast.success("Google Drive Backup Created", {
        description:
          "Encrypted database backup was successfully uploaded to Google Drive.",
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create and upload backup.";
      toast.error("Backup Upload Failed", {
        description: errorMessage,
      });
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
      toast.success("Backup File Imported", {
        description:
          "The backup archive was validated and imported into the system.",
      });
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to import backup.";
      toast.error("Backup Import Failed", {
        description: errorMessage,
      });
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
      toast.success("Database Restored Successfully", {
        description:
          "Database records have been restored. Please log in with credentials from the backup.",
      });
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to restore backup.";
      toast.error("Database Restoration Failed", {
        description: errorMessage,
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-status"] });
      toast.success("Google Drive Disconnected", {
        description: "Your Google account has been unlinked from backup storage.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Disconnect Google Drive", {
        description:
          error?.response?.data?.message || "Could not unlink Google account.",
      });
    },
  });
}
