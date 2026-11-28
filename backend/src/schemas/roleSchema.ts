import { z } from "zod";
import { FEATURE_KEY_SET } from "../rbac/features";
import { PERMISSION_SET } from "../rbac/permissions";

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(40, "Role name must not exceed 40 characters."),
  description: z
    .string()
    .trim()
    .max(200, "Description must not exceed 200 characters.")
    .optional()
    .or(z.literal("")),
  cloneFromRoleId: z.string().uuid().optional(),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(40, "Role name must not exceed 40 characters."),
  description: z
    .string()
    .trim()
    .max(200, "Description must not exceed 200 characters.")
    .optional()
    .or(z.literal("")),
});

export const updateRolePermissionsSchema = z.object({
  permissions: z
    .array(z.string())
    .refine(
      (perms) => perms.every((p) => PERMISSION_SET.has(p)),
      "One or more permissions are invalid.",
    ),
});

const featureStateEnum = z.enum(["ENABLED", "DISABLED", "HIDDEN"]);

export const updateRoleFeaturesSchema = z.object({
  features: z
    .record(z.string(), featureStateEnum)
    .refine(
      (obj) => Object.keys(obj).every((k) => FEATURE_KEY_SET.has(k)),
      "One or more feature keys are invalid.",
    ),
});
