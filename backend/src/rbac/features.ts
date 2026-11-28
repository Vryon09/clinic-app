export const FEATURES = [
  { key: "dashboard", label: "Dashboard", parent: null },
  { key: "patients", label: "Patients", parent: null },
  {
    key: "patients.consultations",
    label: "Consultations",
    parent: "patients",
  },
  {
    key: "patients.labRequests",
    label: "Lab Requests",
    parent: "patients",
  },
  {
    key: "patients.medicalCertificates",
    label: "Medical Certificates",
    parent: "patients",
  },
  {
    key: "patients.labResults",
    label: "Lab Results",
    parent: "patients",
  },
  { key: "billing", label: "Billing", parent: null },
  { key: "settings.general", label: "Settings › General", parent: null },
  {
    key: "settings.activityLog",
    label: "Settings › Activity Log",
    parent: null,
  },
  { key: "settings.archive", label: "Settings › Archive", parent: null },
  { key: "settings.backup", label: "Settings › Backup", parent: null },
] as const;

export type FeatureKey = (typeof FEATURES)[number]["key"];
export type FeatureState = "ENABLED" | "DISABLED" | "HIDDEN";

export const ALL_FEATURE_KEYS: FeatureKey[] = FEATURES.map((f) => f.key);
export const FEATURE_KEY_SET = new Set<string>(ALL_FEATURE_KEYS);

export const FEATURE_PARENT_MAP: Record<FeatureKey, FeatureKey | null> =
  FEATURES.reduce(
    (acc, f) => {
      acc[f.key] = f.parent;
      return acc;
    },
    {} as Record<FeatureKey, FeatureKey | null>,
  );
