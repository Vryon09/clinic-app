import api from "@/lib/api";
import type {
  CreateMedicalCertificatePayload,
  IMedCertLabResults,
  IMedCertPhysicalExam,
  IMedCertVitalSigns,
  IMedicalCertificate,
  UpdateMedicalCertificatePayload,
} from "@/types/MedicalCertificateType";
import type { PaginatedResponse } from "@/types/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

function parseJsonSafe<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseVitalSigns(raw?: string | null): IMedCertVitalSigns {
  return parseJsonSafe<IMedCertVitalSigns>(raw, {});
}

export function parsePhysicalExam(raw?: string | null): IMedCertPhysicalExam {
  return parseJsonSafe<IMedCertPhysicalExam>(raw, {});
}

export function parseLabResults(raw?: string | null): IMedCertLabResults {
  return parseJsonSafe<IMedCertLabResults>(raw, {});
}

export async function handleGetPatientMedicalCertificates({
  patientId,
  page = 1,
  limit = 10,
}: {
  patientId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<IMedicalCertificate>> {
  const res = await api.get(
    `/api/medicalCertificates/patient/${patientId}?page=${page}&limit=${limit}`,
  );
  return res.data;
}

export async function handleGetMedicalCertificate(
  id: string,
): Promise<IMedicalCertificate> {
  const res = await api.get(`/api/medicalCertificates/${id}`);
  return res.data;
}

async function handleCreateMedicalCertificate(
  payload: CreateMedicalCertificatePayload,
) {
  const res = await api.post("/api/medicalCertificates", payload);
  return res.data as IMedicalCertificate;
}

async function handleUpdateMedicalCertificate({
  id,
  ...body
}: UpdateMedicalCertificatePayload) {
  const res = await api.patch(`/api/medicalCertificates/${id}`, body);
  return res.data as IMedicalCertificate;
}

async function handleDeleteMedicalCertificate(id: string) {
  const res = await api.delete(`/api/medicalCertificates/${id}`);
  return res.data;
}

export function usePatientMedicalCertificates(patientId: string, page = 1) {
  return useQuery<PaginatedResponse<IMedicalCertificate>>({
    queryKey: ["medicalCertificates", patientId, page],
    queryFn: () => handleGetPatientMedicalCertificates({ patientId, page }),
    enabled: !!patientId,
  });
}

export function useMedicalCertificate(id?: string | null) {
  return useQuery<IMedicalCertificate>({
    queryKey: ["medicalCertificate", id],
    queryFn: () => handleGetMedicalCertificate(id!),
    enabled: !!id,
  });
}

export function useCreateMedicalCertificate() {
  const queryClient = useQueryClient();
  return useMutation<
    IMedicalCertificate,
    AxiosError<{ message: string }>,
    CreateMedicalCertificatePayload
  >({
    mutationFn: handleCreateMedicalCertificate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medicalCertificates", data.patientId],
      });
      toast.success("Medical Certificate Saved", {
        description: "Medical certificate saved to patient record.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Save Medical Certificate", {
        description:
          error?.response?.data?.message ||
          "Could not create medical certificate.",
      });
    },
  });
}

export function useUpdateMedicalCertificate() {
  const queryClient = useQueryClient();
  return useMutation<
    IMedicalCertificate,
    AxiosError<{ message: string }>,
    UpdateMedicalCertificatePayload
  >({
    mutationFn: handleUpdateMedicalCertificate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medicalCertificates", data.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicalCertificate", data.id],
      });
      toast.success("Medical Certificate Updated", {
        description: "Medical certificate updated.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Update Medical Certificate", {
        description:
          error?.response?.data?.message ||
          "Could not update medical certificate.",
      });
    },
  });
}

export function useDeleteMedicalCertificate() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<{ message: string }>, string>({
    mutationFn: handleDeleteMedicalCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalCertificates"] });
      toast.success("Medical Certificate Deleted", {
        description: "Medical certificate removed from patient record.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Delete Medical Certificate", {
        description:
          error?.response?.data?.message ||
          "Could not delete medical certificate.",
      });
    },
  });
}
