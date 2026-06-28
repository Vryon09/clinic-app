import type { ICase } from "./CaseType";
import type { IRecord } from "./RecordType";

export interface IUser {
  id: string;
  username: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  licenseNum: string;
  isActive: boolean;
}
export interface IMe extends IUser {
  password: string;
}

export interface IDoctor extends IUser {
  cases: ICase[];
  createdRecords: IRecord[];
  createdAt: Date;
}
