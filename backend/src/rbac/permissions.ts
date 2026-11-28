export const PERMISSIONS = {
  PATIENT_CREATE: "patient:create",
  PATIENT_UPDATE: "patient:update",
  PATIENT_ARCHIVE: "patient:archive",
  PATIENT_DELETE: "patient:delete",

  RECORD_CREATE: "record:create",
  RECORD_UPDATE: "record:update",
  RECORD_DELETE: "record:delete",
  RECORD_ARCHIVE: "record:archive",

  CASE_MANAGE: "case:manage",
  LAB_REQUEST_MANAGE: "labRequest:manage",
  MED_CERT_MANAGE: "medCert:manage",
  LAB_RESULT_MANAGE: "labResult:manage",

  BILLING_VIEW: "billing:view",
  BILLING_CREATE: "billing:create",
  BILLING_UPDATE: "billing:update",
  BILLING_PAYMENT: "billing:payment",
  BILLING_ADMIN: "billing:admin",

  CLINICAL_ATTENDING: "clinical:attending",
  CLINIC_UPDATE: "clinic:update",
  ARCHIVE_RESTORE: "archive:restore",
  BACKUP_MANAGE: "backup:manage",
  ACTIVITY_LOG_VIEW: "activityLog:view",
  DASHBOARD_ADMIN: "dashboard:admin",
  SYSTEM_RESET: "system:reset",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const PERMISSION_SET = new Set<string>(ALL_PERMISSIONS);

export interface PermissionItem {
  key: Permission;
  label: string;
  description: string;
}

export interface PermissionGroup {
  group: string;
  items: PermissionItem[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: "Patients",
    items: [
      {
        key: PERMISSIONS.PATIENT_CREATE,
        label: "Create Patients",
        description: "Register new patient profiles.",
      },
      {
        key: PERMISSIONS.PATIENT_UPDATE,
        label: "Update Patients",
        description:
          "Edit patient demographics, contact details, and allergies.",
      },
      {
        key: PERMISSIONS.PATIENT_ARCHIVE,
        label: "Archive Patients",
        description: "Move patient profiles to the archive.",
      },
      {
        key: PERMISSIONS.PATIENT_DELETE,
        label: "Delete Patients",
        description: "Permanently delete patient records.",
      },
    ],
  },
  {
    group: "Consultations & Cases",
    items: [
      {
        key: PERMISSIONS.RECORD_CREATE,
        label: "Create Consultations",
        description: "Add new consultation records, vitals, and medications.",
      },
      {
        key: PERMISSIONS.RECORD_UPDATE,
        label: "Update Consultations",
        description: "Edit existing consultation records.",
      },
      {
        key: PERMISSIONS.RECORD_ARCHIVE,
        label: "Archive Consultations",
        description: "Move consultation records to the archive.",
      },
      {
        key: PERMISSIONS.RECORD_DELETE,
        label: "Delete Consultations",
        description: "Permanently delete consultation records.",
      },
      {
        key: PERMISSIONS.CASE_MANAGE,
        label: "Manage Cases",
        description: "Create, update, and archive patient cases.",
      },
    ],
  },
  {
    group: "Clinical Documents",
    items: [
      {
        key: PERMISSIONS.LAB_REQUEST_MANAGE,
        label: "Manage Lab Requests",
        description: "Create, edit, and delete patient laboratory requests.",
      },
      {
        key: PERMISSIONS.MED_CERT_MANAGE,
        label: "Manage Medical Certificates",
        description: "Create, edit, and delete patient medical certificates.",
      },
      {
        key: PERMISSIONS.LAB_RESULT_MANAGE,
        label: "Manage Lab Results",
        description: "Upload and delete laboratory result files.",
      },
    ],
  },
  {
    group: "Billing",
    items: [
      {
        key: PERMISSIONS.BILLING_VIEW,
        label: "View Billing",
        description: "View invoices, receipts, and service catalog.",
      },
      {
        key: PERMISSIONS.BILLING_CREATE,
        label: "Create Invoices",
        description: "Create new billing invoices.",
      },
      {
        key: PERMISSIONS.BILLING_UPDATE,
        label: "Update Invoices & Services",
        description:
          "Edit invoices, cancel invoices, and manage service catalog.",
      },
      {
        key: PERMISSIONS.BILLING_PAYMENT,
        label: "Record Payments",
        description: "Record payments and issue receipts.",
      },
      {
        key: PERMISSIONS.BILLING_ADMIN,
        label: "Delete Billing Services",
        description: "Permanently remove services from the billing catalog.",
      },
    ],
  },
  {
    group: "Clinical Identity",
    items: [
      {
        key: PERMISSIONS.CLINICAL_ATTENDING,
        label: "Attending Physician",
        description:
          "Appear in attending doctor lists and manage license number & digital signature.",
      },
    ],
  },
  {
    group: "Settings & System",
    items: [
      {
        key: PERMISSIONS.CLINIC_UPDATE,
        label: "Update Clinic Info",
        description: "Edit clinic name, address, phone, and logo.",
      },
      {
        key: PERMISSIONS.ACTIVITY_LOG_VIEW,
        label: "View Activity Log",
        description: "View system audit and activity logs.",
      },
      {
        key: PERMISSIONS.ARCHIVE_RESTORE,
        label: "Restore Archived Items",
        description: "Restore archived patients, cases, and consultations.",
      },
      {
        key: PERMISSIONS.BACKUP_MANAGE,
        label: "Manage Backups",
        description: "Connect Google Drive and trigger cloud backups.",
      },
      {
        key: PERMISSIONS.DASHBOARD_ADMIN,
        label: "Dashboard Admin Snapshot",
        description:
          "View active user counts and recent logs on the dashboard.",
      },
      {
        key: PERMISSIONS.SYSTEM_RESET,
        label: "Reset Database",
        description: "Wipe all clinic and patient data from the database.",
      },
    ],
  },
];
