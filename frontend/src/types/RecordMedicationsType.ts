import type { CreateRecordMedicationInput } from "@/schemas/recordMedication";
import type { IDate } from "./DateType";
import type { IRecordForm, RecordFormValues } from "./RecordType";
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

export interface IRecordMedications extends CreateRecordMedicationInput, IDate {
  id: string;
  recordId: string;
  visitDate: Date;
}

export interface IRecordMedicationForm extends IRecordForm {
  recordMedicationField: FieldArrayWithId<
    RecordFormValues,
    "recordMedications",
    "id"
  >[];
  addMedication: UseFieldArrayAppend<RecordFormValues, "recordMedications">;
  deleteMedication: UseFieldArrayRemove;
  getValues: UseFormGetValues<RecordFormValues>;
  setValue: UseFormSetValue<RecordFormValues>;
  errors: FieldErrors<RecordFormValues>;
  setError: UseFormSetError<RecordFormValues>;
}

export interface IAddedRecordMedicationList {
  recordMedicationField: FieldArrayWithId<
    RecordFormValues,
    "recordMedications",
    "id"
  >[];
  deleteMedication: UseFieldArrayRemove;
}

export interface IRecordMedicationDialog extends IRecordForm {
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  addMedication: UseFieldArrayAppend<RecordFormValues, "recordMedications">;
  getValues: UseFormGetValues<RecordFormValues>;
  setValue: UseFormSetValue<RecordFormValues>;
  errors: FieldErrors<RecordFormValues>;
  setError: UseFormSetError<RecordFormValues>;
}
