import type { IDate } from "./DateType";
import type { CreateVitalSignsInput } from "@/schemas/vitalSignsSchema";

export interface IVitalSigns extends CreateVitalSignsInput, IDate {
  id: string;
  recordId: string;
  visitDate: Date;
}
