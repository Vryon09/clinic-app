import type { CreateRecordMedicationInput } from "@/schemas/recordMedication";
import type { IDate } from "./DateType";

export interface IRecordMedications extends CreateRecordMedicationInput, IDate {
  id: string;
  recordId: string;
  visitDate: Date;
}
