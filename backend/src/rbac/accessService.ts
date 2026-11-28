import { prisma } from "../config/prisma";
import {
  ALL_FEATURE_KEYS,
  FEATURE_PARENT_MAP,
  FeatureKey,
  FeatureState,
} from "./features";
import { ALL_PERMISSIONS } from "./permissions";
import { DEFAULT_ROLES, SUPER_ADMIN_ROLE_KEY } from "./roles";

export interface RoleAccess {
  roleKey: string;
  roleName: string;
  isSuperAdmin: boolean;
  permissions: Set<string>;
  features: Record<FeatureKey, FeatureState>;
}

const accessCache = new Map<string, RoleAccess>();

const STATE_RANK: Record<FeatureState, number> = {
  ENABLED: 0,
  DISABLED: 1,
  HIDDEN: 2,
};

function mostRestrictive(a: FeatureState, b: FeatureState): FeatureState {
  return STATE_RANK[a] >= STATE_RANK[b] ? a : b;
}

function buildDefaultFeatures(state: FeatureState = "ENABLED"): Record<FeatureKey, FeatureState> {
  return ALL_FEATURE_KEYS.reduce(
    (acc, key) => {
      acc[key] = state;
      return acc;
    },
    {} as Record<FeatureKey, FeatureState>,
  );
}

export function effectiveFeatureState(
  access: RoleAccess,
  key: FeatureKey,
): FeatureState {
  if (access.isSuperAdmin) return "ENABLED";
  const own = access.features[key] ?? "ENABLED";
  const parentKey = FEATURE_PARENT_MAP[key];
  if (!parentKey) return own;
  const parentState = access.features[parentKey] ?? "ENABLED";
  return mostRestrictive(own, parentState);
}

export function computeEffectiveFeatures(
  access: RoleAccess,
): Record<FeatureKey, FeatureState> {
  const result = {} as Record<FeatureKey, FeatureState>;
  for (const key of ALL_FEATURE_KEYS) {
    result[key] = effectiveFeatureState(access, key);
  }
  return result;
}

export async function getRoleAccess(roleKey: string): Promise<RoleAccess | null> {
  const cached = accessCache.get(roleKey);
  if (cached) return cached;

  if (roleKey === SUPER_ADMIN_ROLE_KEY) {
    const dbRole = await prisma.role.findUnique({
      where: { key: SUPER_ADMIN_ROLE_KEY },
      select: { name: true },
    });
    const superAccess: RoleAccess = {
      roleKey: SUPER_ADMIN_ROLE_KEY,
      roleName: dbRole?.name || "Super Administrator",
      isSuperAdmin: true,
      permissions: new Set(ALL_PERMISSIONS),
      features: buildDefaultFeatures("ENABLED"),
    };
    accessCache.set(roleKey, superAccess);
    return superAccess;
  }

  const role = await prisma.role.findUnique({
    where: { key: roleKey },
    include: {
      permissions: true,
      features: true,
    },
  });

  if (!role) return null;

  const features = buildDefaultFeatures("ENABLED");
  for (const f of role.features) {
    if (f.feature in features) {
      features[f.feature as FeatureKey] = f.state as FeatureState;
    }
  }

  const access: RoleAccess = {
    roleKey: role.key,
    roleName: role.name,
    isSuperAdmin: false,
    permissions: new Set(role.permissions.map((p) => p.permission)),
    features,
  };

  accessCache.set(roleKey, access);
  return access;
}

export function invalidateAccessCache(roleKey?: string) {
  if (roleKey) {
    accessCache.delete(roleKey);
  } else {
    accessCache.clear();
  }
}

export async function seedDefaultRoles() {
  for (const def of DEFAULT_ROLES) {
    const existing = await prisma.role.findUnique({
      where: { key: def.key },
    });
    if (existing) continue;

    await prisma.role.create({
      data: {
        key: def.key,
        name: def.name,
        description: def.description,
        isSystem: def.isSystem,
        permissions: {
          create: def.permissions.map((permission) => ({ permission })),
        },
        features: {
          create: ALL_FEATURE_KEYS.map((feature) => ({
            feature,
            state: "ENABLED",
          })),
        },
      },
    });
  }
  invalidateAccessCache();
}
