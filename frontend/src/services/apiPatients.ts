import api from "@/lib/api";
import type { CreatePatientInput } from "@/schemas/patientSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function handleGetPatients() {
  const res = await api.get("/api/patients");

  return res.data ?? [];
}

export async function handleGetPatient({ id }: { id: string }) {
  const res = await api.get(`/api/patients/${id}`);

  return res.data ?? {};
}

export async function handleSearchPatients({ search }: { search: string }) {
  const res = await api.get(`/api/patients/search?search=${search.trim()}`);

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
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
