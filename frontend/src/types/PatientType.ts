import type { CreatePatientInput } from "@/schemas/patientSchema";
import type { IDate } from "./DateType";
import type { IRecord } from "./RecordType";

export interface IPatient extends CreatePatientInput, IDate {
  id: string;
  records: IRecord[];
}

export interface PatientFilterParams {
  search?: string;
  page?: number;
  limit?: number;
  sex?: "MALE" | "FEMALE" | "";
  minAge?: number | "";
  maxAge?: number | "";
  hasAllergies?: "all" | "yes" | "no";
}
