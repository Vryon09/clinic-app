import type { Request } from "express";
import type { RoleAccess } from "../rbac/accessService";

export interface UserRequest extends Request {
  userId?: string;
  role?: string;
  access?: RoleAccess;
}
