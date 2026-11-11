import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export async function handleGetClinicInfo() {
  const res = await api.get("/api/clinicInfo");

  return res.data || {};
}

async function handleInitClinicInfo() {
  const res = await api.post("/api/clinicInfo/init");

  return res.data || {};
}

export function useInitClinicInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleInitClinicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
    },
  });
}

async function handleUpdateClinicInfo({
  name,
  address,
  phone,
}: {
  name: string;
  address: string;
  phone: string;
}) {
  const res = await api.patch("/api/clinicInfo/update", {
    name,
    address,
    phone,
  });

  return res.data || {};
}

export function useUpdateClinicInfo() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    {
      name: string;
      address: string;
      phone: string;
    }
  >({
    mutationFn: handleUpdateClinicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
    },
  });
}

export async function handleUploadClinicLogo(file: File) {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await api.post("/api/clinicInfo/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export function useUploadClinicLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUploadClinicLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
      toast.success("Clinic logo updated successfully", {
        position: "top-center",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to upload logo", {
        position: "top-center",
      });
    },
  });
}

export async function handleDeleteClinicLogo() {
  const res = await api.delete("/api/clinicInfo/logo");
  return res.data;
}

export function useDeleteClinicLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteClinicLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinicInfo"] });
      toast.success("Clinic logo removed", {
        position: "top-center",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to remove logo", {
        position: "top-center",
      });
    },
  });
}
