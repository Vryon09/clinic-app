import api from "@/lib/api";
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/schemas/patientSchema";
import type { IPatient, PatientFilterParams } from "@/types/PatientType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export async function handleGetPatients() {
  const res = await api.get("/api/patients");

  return res.data ?? [];
}

export async function handleGetArchivedPatients({ page }: { page: number }) {
  const res = await api.get(`/api/patients/archived?page=${page}&limit=10`);

  return res.data ?? [];
}

export async function handleGetPatient({ id }: { id: string }) {
  const res = await api.get(`/api/patients/${id}`);

  return res.data ?? {};
}

export async function handleSearchPatients(params: PatientFilterParams = {}) {
  const {
    search = "",
    page = 1,
    limit = 10,
    sex,
    minAge,
    maxAge,
    hasAllergies,
  } = params;

  const query = new URLSearchParams();
  if (search.trim()) query.set("search", search.trim());
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (sex) query.set("sex", sex);
  if (minAge !== undefined && minAge !== "") query.set("minAge", String(minAge));
  if (maxAge !== undefined && maxAge !== "") query.set("maxAge", String(maxAge));
  if (hasAllergies && hasAllergies !== "all") query.set("hasAllergies", hasAllergies);

  const res = await api.get(`/api/patients/search?${query.toString()}`);

  return res.data ?? [];
}

async function handleAddPatient({
  firstName,
  middleName,
  lastName,
  phone,
  address,
  sex,
  dateOfBirth,
  allergies,
}: CreatePatientInput): Promise<IPatient> {
  const newPatient = {
    firstName,
    middleName,
    lastName,
    phone,
    address,
    sex,
    dateOfBirth,
    allergies: allergies || undefined,
  };

  const res = await api.post("/api/patients", newPatient);
  return res.data;
}

export function useAddPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddPatient,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient Registered", {
        description: `${variables.firstName} ${variables.lastName} has been added to clinic records.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Register Patient", {
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "An unexpected error occurred while saving the patient record.",
      });
    },
  });
}

async function handleDeletePatient(id: string) {
  const res = await api.delete(`/api/patients/${id}`);

  console.log(res.data.message);
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleDeletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Patient Deleted", {
        description: "The patient record has been permanently removed.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Delete Patient", {
        description:
          error?.response?.data?.message || "Could not delete patient record.",
      });
    },
  });
}

async function handleArchivePatient(id: string) {
  const res = await api.patch(`/api/patients/${id}/archive`);

  console.log(res.data.message);
}

export function useArchivePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleArchivePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast.success("Patient Archived", {
        description:
          "Patient has been moved to Archive. You can restore them anytime from Settings > Archive.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Archive Patient", {
        description:
          error?.response?.data?.message || "Could not archive patient record.",
      });
    },
  });
}

async function handleRestorePatient(id: string) {
  const res = await api.patch(`/api/patients/${id}/restore`);

  console.log(res.data.message);
}

export function useRestorePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRestorePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["archivedPatients"] });
      toast.success("Patient Restored", {
        description: "Patient record has been restored to the active list.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Restore Patient", {
        description:
          error?.response?.data?.message || "Could not restore patient record.",
      });
    },
  });
}

interface IHandleUpdatePatient extends UpdatePatientInput {
  id: string;
}

async function handleUpdatePatient({
  id,
  firstName,
  middleName,
  lastName,
  address,
  dateOfBirth,
  phone,
  sex,
  allergies,
}: IHandleUpdatePatient) {
  const updatedPatientData = {
    firstName,
    middleName,
    lastName,
    address,
    dateOfBirth,
    phone,
    sex,
    allergies: allergies !== undefined ? allergies : undefined,
  };

  const res = await api.patch(`/api/patients/${id}/update`, updatedPatientData);

  return res.data;
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUpdatePatient,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["patient", variables.id] });
      toast.success("Patient Record Updated", {
        description: `Changes saved for ${variables.firstName} ${variables.lastName}.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to Update Patient", {
        description:
          error?.response?.data?.message ||
          "Could not save patient record changes.",
      });
    },
  });
}
