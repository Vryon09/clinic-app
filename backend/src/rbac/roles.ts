import { PERMISSIONS } from "./permissions";

export const rolePermissions = {
  ADMIN: ["*"],
  DOCTOR: [PERMISSIONS.RECORD_CREATE],
  ASSISTANT: [""],
};
