import type { CreateRecordInput } from "@/schemas/recordSchema";
import type { IDate } from "./DateType";
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

export interface IRecord extends CreateRecordInput, IDate {
  id: string;
  patientId: string;
  visitDate: Date;
}

export interface IRecordForm {
  register: UseFormRegister<{
    medicationInput: {
      name?: string | undefined;
      dosage?: string | undefined;
      frequency?: string | undefined;
      durationDays?: number | undefined;
      instructions?: string | undefined;
    };
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
    recordMedications?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }[]
      | undefined;
  }>;
}

export interface IRecordMedicationForm extends IRecordForm {
  recordMedicationField: FieldArrayWithId<
    {
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
      recordMedications?:
        | {
            name: string;
            dosage: string;
            frequency: string;
            durationDays?: number | undefined;
            instructions?: string | undefined;
          }[]
        | undefined;
    },
    "recordMedications",
    "id"
  >[];
  addMedication: UseFieldArrayAppend<
    {
      vitalSigns: {
        bloodPressureSystolic?: number | undefined;
        bloodPressureDiastolic?: number | undefined;
        temperature?: number | undefined;
        weightKg?: number | undefined;
      };
      medicationInput: {
        name?: string | undefined;
        dosage?: string | undefined;
        frequency?: string | undefined;
        durationDays?: number | undefined;
        instructions?: string | undefined;
      };
      symptoms?: string | undefined;
      signs?: string | undefined;
      diagnosis?: string | undefined;
      recordMedications?:
        | {
            name: string;
            dosage: string;
            frequency: string;
            durationDays?: number | undefined;
            instructions?: string | undefined;
          }[]
        | undefined;
    },
    "recordMedications"
  >;
  deleteMedication: UseFieldArrayRemove;
  getValues: UseFormGetValues<{
    vitalSigns: {
      bloodPressureSystolic?: number | undefined;
      bloodPressureDiastolic?: number | undefined;
      temperature?: number | undefined;
      weightKg?: number | undefined;
    };
    medicationInput: {
      name?: string | undefined;
      dosage?: string | undefined;
      frequency?: string | undefined;
      durationDays?: number | undefined;
      instructions?: string | undefined;
    };
    symptoms?: string | undefined;
    signs?: string | undefined;
    diagnosis?: string | undefined;
    recordMedications?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }[]
      | undefined;
  }>;
  setValue: UseFormSetValue<{
    vitalSigns: {
      bloodPressureSystolic?: number | undefined;
      bloodPressureDiastolic?: number | undefined;
      temperature?: number | undefined;
      weightKg?: number | undefined;
    };
    medicationInput: {
      name?: string | undefined;
      dosage?: string | undefined;
      frequency?: string | undefined;
      durationDays?: number | undefined;
      instructions?: string | undefined;
    };
    symptoms?: string | undefined;
    signs?: string | undefined;
    diagnosis?: string | undefined;
    recordMedications?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }[]
      | undefined;
  }>;
  errors: FieldErrors<{
    medicationInput: {
      name?: string | undefined;
      dosage?: string | undefined;
      frequency?: string | undefined;
      durationDays?: number | undefined;
      instructions?: string | undefined;
    };
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
    recordMedications?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }[]
      | undefined;
  }>;
  setError: UseFormSetError<{
    medicationInput: {
      name?: string | undefined;
      dosage?: string | undefined;
      frequency?: string | undefined;
      durationDays?: number | undefined;
      instructions?: string | undefined;
    };
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
    recordMedications?:
      | {
          name: string;
          dosage: string;
          frequency: string;
          durationDays?: number | undefined;
          instructions?: string | undefined;
        }[]
      | undefined;
  }>;
}
