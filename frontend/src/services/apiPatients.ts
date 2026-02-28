import type { CreatePatientInput } from "@/schemas/patientSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export async function handleGetPatients() {
  const res = await axios.get("http://localhost:3000/api/patients");

  return res.data ?? [];
}

export async function handleGetPatient({ id }: { id: string }) {
  const res = await axios.get(`http://localhost:3000/api/patients/${id}`);

  return res.data ?? {};
}

export async function handleSearchPatients({ search }: { search: string }) {
  const res = await axios.get(
    `http://localhost:3000/api/patients/search?search=${search.trim()}`,
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

  const res = await axios.post(
    "http://localhost:3000/api/patients",
    newPatient,
  );
  return res.data;
}

export function useAddPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleAddPatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}
