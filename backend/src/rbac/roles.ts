import { ALL_PERMISSIONS, PERMISSIONS, Permission } from "./permissions";

export interface DefaultRoleDef {
  key: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

export const SUPER_ADMIN_ROLE_KEY = "SUPER_ADMIN";

export const DEFAULT_ROLES: DefaultRoleDef[] = [
  {
    key: SUPER_ADMIN_ROLE_KEY,
    name: "Super Administrator",
    description: "Full system access, user management, and role configuration.",
    isSystem: true,
    permissions: [...ALL_PERMISSIONS],
  },
  {
    key: "ADMIN",
    name: "Clinic Manager",
    description: "Full clinic operations, billing administration, and system reset.",
    isSystem: true,
    permissions: [...ALL_PERMISSIONS].filter(
      (p) => p !== PERMISSIONS.CLINICAL_ATTENDING,
    ),
  },
  {
    key: "DOCTOR",
    name: "Attending Physician",
    description: "Patient care, consultations, clinical documents, and billing.",
    isSystem: true,
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.PATIENT_ARCHIVE,
      PERMISSIONS.PATIENT_DELETE,
      PERMISSIONS.RECORD_CREATE,
      PERMISSIONS.RECORD_UPDATE,
      PERMISSIONS.RECORD_DELETE,
      PERMISSIONS.RECORD_ARCHIVE,
      PERMISSIONS.CASE_MANAGE,
      PERMISSIONS.LAB_REQUEST_MANAGE,
      PERMISSIONS.MED_CERT_MANAGE,
      PERMISSIONS.LAB_RESULT_MANAGE,
      PERMISSIONS.BILLING_VIEW,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_UPDATE,
      PERMISSIONS.BILLING_PAYMENT,
      PERMISSIONS.CLINICAL_ATTENDING,
      PERMISSIONS.CLINIC_UPDATE,
      PERMISSIONS.ARCHIVE_RESTORE,
      PERMISSIONS.BACKUP_MANAGE,
      PERMISSIONS.ACTIVITY_LOG_VIEW,
    ],
  },
  {
    key: "ASSISTANT",
    name: "Clinical Assistant",
    description: "Patient intake, clinical documents, and billing support.",
    isSystem: true,
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_UPDATE,
      PERMISSIONS.PATIENT_ARCHIVE,
      PERMISSIONS.PATIENT_DELETE,
      PERMISSIONS.RECORD_ARCHIVE,
      PERMISSIONS.CASE_MANAGE,
      PERMISSIONS.LAB_REQUEST_MANAGE,
      PERMISSIONS.MED_CERT_MANAGE,
      PERMISSIONS.LAB_RESULT_MANAGE,
      PERMISSIONS.BILLING_VIEW,
      PERMISSIONS.BILLING_CREATE,
      PERMISSIONS.BILLING_UPDATE,
      PERMISSIONS.BILLING_PAYMENT,
      PERMISSIONS.CLINIC_UPDATE,
      PERMISSIONS.ARCHIVE_RESTORE,
      PERMISSIONS.BACKUP_MANAGE,
      PERMISSIONS.ACTIVITY_LOG_VIEW,
    ],
  },
];
