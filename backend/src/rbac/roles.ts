import { PERMISSIONS } from "./permissions";

export const rolePermissions = {
  ADMIN: ["*"],
  DOCTOR: [
    PERMISSIONS.RECORD_CREATE,
    PERMISSIONS.RECORD_UPDATE,
    PERMISSIONS.RECORD_DELETE,
  ],
  ASSISTANT: [""],
};
