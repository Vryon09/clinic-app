import api from "@/lib/api";
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/schemas/patientSchema";
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

export async function handleSearchPatients({
  search,
  page,
}: {
  search: string;
  page: number;
}) {
  const res = await api.get(
    `/api/patients/search?search=${search.trim()}&page=${page}&limit=10`,
  );

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
}: CreatePatientInput) {
  const newPatient = {
    firstName,
    middleName,
    lastName,
    phone,
    address,
    sex,
    dateOfBirth,
  };

  const res = await api.post("/api/patients", newPatient);
  return res.data;
}

export function useAddPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Added patient successfully", { position: "top-center" });
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
}: IHandleUpdatePatient) {
  const updatedPatientData = {
    firstName,
    middleName,
    lastName,
    address,
    dateOfBirth,
    phone,
    sex,
  };

  const res = await api.patch(`/api/patients/${id}/update`, updatedPatientData);

  console.log(res.data);
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleUpdatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("Updated patient successfully", { position: "top-center" });
    },
  });
}
