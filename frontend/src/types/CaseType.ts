import type { IRecord } from "./RecordType";

export interface ICase {
  id: string;
  caseName: string;
  patientId: string;
  records: IRecord[];
}
