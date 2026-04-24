import type { Request } from "express";

export interface UserRequest extends Request {
  userId?: string;
}
