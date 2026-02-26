import type { CreatePatientInput } from "@/schemas/patientSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export async function handleGetPatients() {
  const res = await axios.get("http://localhost:3000/api/patients");

  return res.data ?? [];
}

async function handleAddPatient({ name, age, phone }: CreatePatientInput) {
  const newPatient = { name, age, phone };

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
