import { Response } from "express";
import { prisma } from "../config/prisma";
import { UserRequest } from "../types/express";
import { PERMISSION_GROUPS } from "../rbac/permissions";
import { ALL_FEATURE_KEYS, FEATURES, FeatureState } from "../rbac/features";
import { invalidateAccessCache } from "../rbac/accessService";
import { SUPER_ADMIN_ROLE_KEY } from "../rbac/roles";

function slugifyRoleKey(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function getCatalog(_req: UserRequest, res: Response) {
  return res.status(200).json({
    permissionGroups: PERMISSION_GROUPS,
    features: FEATURES,
  });
}

export async function getRoles(_req: UserRequest, res: Response) {
  try {
    const [roles, userCounts] = await Promise.all([
      prisma.role.findMany({
        orderBy: [{ isSystem: "desc" }, { createdAt: "asc" }],
        include: {
          permissions: { select: { permission: true } },
          features: { select: { feature: true, state: true } },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { _all: true },
      }),
    ]);

    const countMap = new Map<string, number>();
    for (const row of userCounts) {
      countMap.set(row.role, row._count._all);
    }

    const formatted = roles.map((r) => {
      const featureMap: Record<string, FeatureState> = {};
      for (const k of ALL_FEATURE_KEYS) {
        featureMap[k] = "ENABLED";
      }
      for (const f of r.features) {
        featureMap[f.feature] = f.state as FeatureState;
      }

      return {
        id: r.id,
        key: r.key,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        userCount: countMap.get(r.key) ?? 0,
        permissions: r.permissions.map((p) => p.permission),
        features: featureMap,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("getRoles error:", error);
    return res.status(500).json({ message: "Failed to load roles." });
  }
}

export async function createRole(req: UserRequest, res: Response) {
  try {
    const { name, description, cloneFromRoleId } = req.body as {
      name: string;
      description?: string;
      cloneFromRoleId?: string;
    };

    const key = slugifyRoleKey(name);
    if (!key || key === SUPER_ADMIN_ROLE_KEY) {
      return res.status(400).json({ message: "Invalid role name." });
    }

    const existing = await prisma.role.findUnique({ where: { key } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "A role with a matching key already exists." });
    }

    let seedPermissions: string[] = [];
    let seedFeatures: { feature: string; state: FeatureState }[] =
      ALL_FEATURE_KEYS.map((feature) => ({ feature, state: "ENABLED" }));

    if (cloneFromRoleId) {
      const source = await prisma.role.findUnique({
        where: { id: cloneFromRoleId },
        include: { permissions: true, features: true },
      });
      if (!source) {
        return res.status(404).json({ message: "Source role not found." });
      }
      seedPermissions = source.permissions.map((p) => p.permission);
      const sourceMap = new Map(
        source.features.map((f) => [f.feature, f.state as FeatureState]),
      );
      seedFeatures = ALL_FEATURE_KEYS.map((feature) => ({
        feature,
        state: sourceMap.get(feature) ?? "ENABLED",
      }));
    }

    const created = await prisma.role.create({
      data: {
        key,
        name: name.trim(),
        description: description?.trim() || null,
        isSystem: false,
        permissions: {
          create: seedPermissions.map((permission) => ({ permission })),
        },
        features: {
          create: seedFeatures,
        },
      },
      include: {
        permissions: { select: { permission: true } },
        features: { select: { feature: true, state: true } },
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Role",
        target: created.name,
        details: `Created custom role ${created.name} (${created.key})`,
        userId: req.userId!,
      },
    });

    invalidateAccessCache();
    return res.status(201).json(created);
  } catch (error) {
    console.error("createRole error:", error);
    return res.status(500).json({ message: "Failed to create role." });
  }
}

export async function updateRole(req: UserRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { name, description } = req.body as {
      name: string;
      description?: string;
    };

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    if (role.key === SUPER_ADMIN_ROLE_KEY) {
      return res
        .status(400)
        .json({ message: "Super Admin role cannot be modified." });
    }

    const updated = await prisma.role.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Role",
        target: updated.name,
        details: `Updated role details for ${updated.name} (${updated.key})`,
        userId: req.userId!,
      },
    });

    invalidateAccessCache(role.key);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateRole error:", error);
    return res.status(500).json({ message: "Failed to update role." });
  }
}

export async function updateRolePermissions(req: UserRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { permissions } = req.body as { permissions: string[] };

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    if (role.key === SUPER_ADMIN_ROLE_KEY) {
      return res
        .status(400)
        .json({ message: "Super Admin permissions cannot be modified." });
    }

    const uniquePerms = Array.from(new Set(permissions));

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      ...uniquePerms.map((permission) =>
        prisma.rolePermission.create({
          data: { roleId: id, permission },
        }),
      ),
    ]);

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Role",
        target: role.name,
        details: `Updated permissions for ${role.name} (${uniquePerms.length} granted)`,
        userId: req.userId!,
      },
    });

    invalidateAccessCache(role.key);
    return res.status(200).json({ permissions: uniquePerms });
  } catch (error) {
    console.error("updateRolePermissions error:", error);
    return res.status(500).json({ message: "Failed to update permissions." });
  }
}

export async function updateRoleFeatures(req: UserRequest, res: Response) {
  try {
    const id = String(req.params.id);
    const { features } = req.body as {
      features: Record<string, FeatureState>;
    };

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    if (role.key === SUPER_ADMIN_ROLE_KEY) {
      return res
        .status(400)
        .json({ message: "Super Admin feature access cannot be modified." });
    }

    await prisma.$transaction(
      Object.entries(features).map(([feature, state]) =>
        prisma.roleFeature.upsert({
          where: { roleId_feature: { roleId: id, feature } },
          update: { state },
          create: { roleId: id, feature, state },
        }),
      ),
    );

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Role",
        target: role.name,
        details: `Updated feature access for ${role.name}`,
        userId: req.userId!,
      },
    });

    invalidateAccessCache(role.key);
    return res.status(200).json({ features });
  } catch (error) {
    console.error("updateRoleFeatures error:", error);
    return res.status(500).json({ message: "Failed to update features." });
  }
}

export async function deleteRole(req: UserRequest, res: Response) {
  try {
    const id = String(req.params.id);

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    if (role.isSystem) {
      return res
        .status(400)
        .json({ message: "System roles cannot be deleted." });
    }

    const assignedUsers = await prisma.user.count({
      where: { role: role.key },
    });
    if (assignedUsers > 0) {
      return res.status(400).json({
        message: `Cannot delete role while ${assignedUsers} user(s) are assigned to it.`,
      });
    }

    await prisma.role.delete({ where: { id } });

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Role",
        target: role.name,
        details: `Deleted custom role ${role.name} (${role.key})`,
        userId: req.userId!,
      },
    });

    invalidateAccessCache(role.key);
    return res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("deleteRole error:", error);
    return res.status(500).json({ message: "Failed to delete role." });
  }
}
