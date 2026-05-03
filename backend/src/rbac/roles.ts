import { PERMISSIONS } from "./permissions";

export const rolePermissions = {
  ADMIN: ["*"],
  DOCTOR: [PERMISSIONS.USER_CREATE],
  ASSISTANT: [""],
};
