import type { CreateRecordInput } from "@/schemas/recordSchema";
import type { IDate } from "./DateType";
import type { UseFormRegister } from "react-hook-form";

export interface IRecord extends CreateRecordInput, IDate {
  id: string;
  patientId: string;
  visitDate: Date;
}

export interface IRecordForm {
  register: UseFormRegister<{
    symptoms?: string | undefined;
    signs?: string | undefined;
    diagnosis?: string | undefined;
    vitalSigns?:
      | {
          bloodPressureSystolic?: number | undefined;
          bloodPressureDiastolic?: number | undefined;
          temperature?: number | undefined;
          weightKg?: number | undefined;
        }
      | undefined;
    recordMedication?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }
      | undefined;
  }>;
}
