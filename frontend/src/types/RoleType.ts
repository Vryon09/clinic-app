import type { FeatureKey, FeatureState } from "@/lib/features";

export interface IPermissionItem {
  key: string;
  label: string;
  description: string;
}

export interface IPermissionGroup {
  group: string;
  items: IPermissionItem[];
}

export interface IFeatureDef {
  key: FeatureKey;
  label: string;
  parent: FeatureKey | null;
}

export interface IRoleCatalog {
  permissionGroups: IPermissionGroup[];
  features: IFeatureDef[];
}

export interface IRole {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
  features: Record<FeatureKey, FeatureState>;
  createdAt: string;
  updatedAt: string;
}
