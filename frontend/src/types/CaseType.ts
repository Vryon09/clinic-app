import type { IRecord } from "./RecordType";
import type { IDoctor } from "./User";

export interface ICase {
  id: string;
  caseName: string;
  patientId: string;
  records: IRecord[];
  doctor: IDoctor;
}
