import { NextFunction, Response } from "express";
import { UserRequest } from "../types/express";
import { Permission } from "../rbac/permissions";

export function authorize(permission: Permission | string) {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const access = req.access;

    if (!access) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (access.isSuperAdmin || access.permissions.has(permission)) {
      return next();
    }

    return res.status(403).json({
      code: "FORBIDDEN",
      message: "You don't have permission for this action.",
    });
  };
}

export function requireSuperAdmin(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  const access = req.access;
  if (!access) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!access.isSuperAdmin) {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Super Admin access required.",
    });
  }
  return next();
}
