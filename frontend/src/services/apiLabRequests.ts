import api from "@/lib/api";
import type {
  CreateLabRequestPayload,
  ILabRequest,
  ILabRequestCustomTests,
  ILabRequestSelectedTests,
  UpdateLabRequestPayload,
} from "@/types/LabRequestType";
import type { PaginatedResponse } from "@/types/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export function parseSelectedTests(raw?: string | null): ILabRequestSelectedTests {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ILabRequestSelectedTests;
  } catch {
    return {};
  }
}

export function parseCustomTests(raw?: string | null): ILabRequestCustomTests {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ILabRequestCustomTests;
  } catch {
    return {};
  }
}

export async function handleGetPatientLabRequests({
  patientId,
  page = 1,
  limit = 10,
}: {
  patientId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<ILabRequest>> {
  const res = await api.get(
    `/api/labRequests/patient/${patientId}?page=${page}&limit=${limit}`,
  );
  return res.data;
}

export async function handleGetLabRequest(id: string): Promise<ILabRequest> {
  const res = await api.get(`/api/labRequests/${id}`);
  return res.data;
}

async function handleCreateLabRequest(payload: CreateLabRequestPayload) {
  const res = await api.post("/api/labRequests", payload);
  return res.data as ILabRequest;
}

async function handleUpdateLabRequest({ id, ...body }: UpdateLabRequestPayload) {
  const res = await api.patch(`/api/labRequests/${id}`, body);
  return res.data as ILabRequest;
}

async function handleDeleteLabRequest(id: string) {
  const res = await api.delete(`/api/labRequests/${id}`);
  return res.data;
}

export function usePatientLabRequests(patientId: string, page = 1) {
  return useQuery<PaginatedResponse<ILabRequest>>({
    queryKey: ["labRequests", patientId, page],
    queryFn: () => handleGetPatientLabRequests({ patientId, page }),
    enabled: !!patientId,
  });
}

export function useLabRequest(id?: string | null) {
  return useQuery<ILabRequest>({
    queryKey: ["labRequest", id],
    queryFn: () => handleGetLabRequest(id!),
    enabled: !!id,
  });
}

export function useCreateLabRequest() {
  const queryClient = useQueryClient();
  return useMutation<
    ILabRequest,
    AxiosError<{ message: string }>,
    CreateLabRequestPayload
  >({
    mutationFn: handleCreateLabRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["labRequests", data.patientId] });
      toast.success("Lab Request Saved", {
        description: "Laboratory request saved to patient record.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Save Lab Request", {
        description:
          error?.response?.data?.message || "Could not create laboratory request.",
      });
    },
  });
}

export function useUpdateLabRequest() {
  const queryClient = useQueryClient();
  return useMutation<
    ILabRequest,
    AxiosError<{ message: string }>,
    UpdateLabRequestPayload
  >({
    mutationFn: handleUpdateLabRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["labRequests", data.patientId] });
      queryClient.invalidateQueries({ queryKey: ["labRequest", data.id] });
      toast.success("Lab Request Updated", {
        description: "Laboratory request updated.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Update Lab Request", {
        description:
          error?.response?.data?.message || "Could not update laboratory request.",
      });
    },
  });
}

export function useDeleteLabRequest() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<{ message: string }>, string>({
    mutationFn: handleDeleteLabRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labRequests"] });
      toast.success("Lab Request Deleted", {
        description: "Laboratory request removed from patient record.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Delete Lab Request", {
        description:
          error?.response?.data?.message || "Could not delete laboratory request.",
      });
    },
  });
}
