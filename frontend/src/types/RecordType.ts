import type { CreateRecordInput } from "@/schemas/recordSchema";
import type { IDate } from "./DateType";

export interface IRecord extends CreateRecordInput, IDate {
  id: string;
  visitDate: Date;
}
