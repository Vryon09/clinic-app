import type { CreatePatientInput } from "@/schemas/patientSchema";

export interface IPatient extends CreatePatientInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
