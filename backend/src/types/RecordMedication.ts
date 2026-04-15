import { CreateRecordMedicationInput } from "../schemas/recordMedication";

export interface IRecordMedication extends CreateRecordMedicationInput {
  recordId: string;
}
