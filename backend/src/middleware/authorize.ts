import { NextFunction, Response } from "express";
import { UserRequest } from "../types/express";
import { rolePermissions } from "../rbac/roles";

export function authorize(permission: string) {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const role: "ADMIN" | "DOCTOR" | "ASSISTANT" = req.role!;

    if (!role) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const permissions = rolePermissions[role];

    if (!permissions) {
      return res.status(400).json({ message: "Role not found" });
    }

    if (permissions.includes("*") || permissions.includes(permission)) {
      return next();
    }

    return res.status(400).json({ message: "Forbidden" });
  };
}
