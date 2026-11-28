import type {
  IMedCertPhysicalExam,
  MedCertFitnessClass,
  MedicalCertificateTemplateType,
} from "@/types/MedicalCertificateType";

export interface MedCertTemplateOption {
  value: MedicalCertificateTemplateType;
  label: string;
  shortLabel: string;
  description: string;
}

export const MED_CERT_TEMPLATES: MedCertTemplateOption[] = [
  {
    value: "GENERAL_CLEARANCE",
    label: "General Check-up & Fit Clearance",
    shortLabel: "General Clearance",
    description:
      "Vital signs, physical & mental fitness statement, remarks, and purpose (employment / school entrance).",
  },
  {
    value: "CONSULTATION_DIAGNOSIS",
    label: "Consultation & Diagnosis Certificate",
    shortLabel: "Consultation / Diagnosis",
    description:
      "Clinic visit date, reason for consultation, diagnosis, recommendations, and non-medico-legal disclaimer.",
  },
  {
    value: "PRE_EMPLOYMENT_PE",
    label: "Pre-Employment / Comprehensive PE",
    shortLabel: "Pre-Employment PE",
    description:
      "Full 7-system physical exam, lab & diagnostic results, Class A–D fitness classification, diagnosis, and remarks.",
  },
];

export const DEFAULT_PHYSICAL_EXAM: Required<IMedCertPhysicalExam> = {
  generalAppearance: "well-developed, well nourished",
  heent:
    "Head is normocephalic. Ears, eyes, nose, throat are all within normal limits.",
  neck: "supple, no cervical lymphadenopathy.",
  chest:
    "reveals symmetrical chest expansion, clear breath sounds, no rales, no wheezes.",
  heart: "adynamic precordium, normal rate, regular rhythm without murmur",
  abdomen: "normoactive bowel sounds, soft, nontender",
  extremities:
    "Reveals full range of motion of all extremities. No cyanosis, no clubbing",
};

export const PHYSICAL_EXAM_FIELDS: Array<{
  key: keyof IMedCertPhysicalExam;
  label: string;
}> = [
  { key: "generalAppearance", label: "GENERAL APPEARANCE" },
  { key: "heent", label: "HEENT" },
  { key: "neck", label: "NECK" },
  { key: "chest", label: "CHEST" },
  { key: "heart", label: "HEART" },
  { key: "abdomen", label: "ABDOMEN" },
  { key: "extremities", label: "EXTREMITIES" },
];

export const LAB_RESULT_LEFT_FIELDS: Array<{
  key: "cbc" | "urinalysis" | "fecalysis" | "ecg";
  label: string;
}> = [
  { key: "cbc", label: "Complete Blood Count" },
  { key: "urinalysis", label: "Urinalysis" },
  { key: "fecalysis", label: "Fecalysis" },
  { key: "ecg", label: "ECG" },
];

export const LAB_RESULT_RIGHT_FIELDS: Array<{
  key: "hepaBScreening" | "cxr" | "others";
  label: string;
}> = [
  { key: "hepaBScreening", label: "Hepa B - Screening" },
  { key: "cxr", label: "CXR" },
  { key: "others", label: "Others" },
];

export const FITNESS_CLASS_OPTIONS: Array<{
  value: Exclude<MedCertFitnessClass, "">;
  code: string;
  description: string;
}> = [
  {
    value: "CLASS_A",
    code: "Class A",
    description: "Physically Fit to work",
  },
  {
    value: "CLASS_B",
    code: "Class B",
    description: "With correctable defects but otherwise fit",
  },
  {
    value: "CLASS_C",
    code: "Class C",
    description:
      "With certain impairments or condition which require follow up treatment / periodic evaluation",
  },
  {
    value: "CLASS_D",
    code: "Class D",
    description: "Not fit to work",
  },
];

export function getTemplateLabel(type: MedicalCertificateTemplateType): string {
  return (
    MED_CERT_TEMPLATES.find((t) => t.value === type)?.shortLabel ??
    "Medical Certificate"
  );
}
