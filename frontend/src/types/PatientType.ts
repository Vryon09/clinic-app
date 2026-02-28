import type { CreatePatientInput } from "@/schemas/patientSchema";
import type { IDate } from "./DateType";
import type { IRecord } from "./RecordType";

export interface IPatient extends CreatePatientInput, IDate {
  id: string;
  records: IRecord[];
}
