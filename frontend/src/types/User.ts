import type { FeatureKey, FeatureState } from "@/lib/features";
import type { ICase } from "./CaseType";
import type { IRecord } from "./RecordType";

export interface IUser {
  id: string;
  username: string;
  role: string;
  roleName?: string;
  isSuperAdmin?: boolean;
  permissions?: string[];
  features?: Record<FeatureKey, FeatureState>;
  licenseNum: string;
  isActive: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IMe extends IUser {
  password: string;
}

export interface IDoctor extends IUser {
  cases: ICase[];
  createdRecords: IRecord[];
  createdAt: Date;
}
