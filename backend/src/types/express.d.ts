import type { RoleAccess } from "../rbac/accessService";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      access?: RoleAccess;
    }
  }
}

export {};
