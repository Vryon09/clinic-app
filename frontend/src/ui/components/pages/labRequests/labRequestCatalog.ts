import type { LabRequestCategoryKey } from "@/types/LabRequestType";

export interface LabCategoryConfig {
  key: LabRequestCategoryKey;
  title: string;
  items: string[];
  hasOthers?: boolean;
  othersFieldKey?: "bloodChemistryOthers" | "xrayOthers" | "ecgOthers";
}

export const LAB_REQUEST_CATEGORIES: LabCategoryConfig[] = [
  {
    key: "laboratory",
    title: "LABORATORY",
    items: [
      "Complete Blood Count",
      "Blood Typing",
      "Hepa B Screening",
      "VDRL",
      "Urinalysis",
      "Fecalysis",
      "Platelet Count",
      "Dengue Duo",
      "Typhidot",
      "Peripheral Blood Smear",
      "Pregnancy Test",
      "( 50 / 75 / 100 ) gram OGTT",
      "HBA1C",
      "PSA",
      "Culture / Sensitivity",
    ],
  },
  {
    key: "bloodChemistry",
    title: "BLOOD CHEMISTRY",
    items: [
      "FBS",
      "BUA",
      "Creatinine",
      "SGPT",
      "Lipid Profile",
      "Triglyceride",
      "Cholesterol",
      "HDL",
      "LDL",
      "BUN",
      "SGOT",
      "CL",
      "NA+, K+",
      "Total Calcium",
      "Ionized Calcium",
      "Hepatitis Profile",
      "T3, T4, TSH (TFT)",
      "FT4, TSH",
      "Protime (PTPA)",
      "aPTT",
      "ESR",
      "ASO-TITER",
      "CRP",
      "RF-RA",
      "Serum CA-125",
      "Serum CA-19-9",
    ],
    hasOthers: true,
    othersFieldKey: "bloodChemistryOthers",
  },
  {
    key: "ultrasound",
    title: "ULTRASOUND",
    items: [
      "Whole Abdomen",
      "Whole Ab. + Prostate",
      "Upper Abdomen",
      "Lower Abdomen",
      "Lower Ab. + Prostate",
      "Pelvic",
      "BPS",
      "KUB - Pelvic",
      "Breast",
    ],
  },
  {
    key: "xray",
    title: "X-RAY",
    items: [
      "Chest",
      "Extremities",
      "Skull",
      "PNS",
      "Lumbosacral",
      "Thoracolumbar",
      "T-cage",
      "Cervical",
    ],
    hasOthers: true,
    othersFieldKey: "xrayOthers",
  },
  {
    key: "twoDEcho",
    title: "2D ECHO",
    items: [
      "Hepato-Biliary Tree",
      "HBT with Pancreas",
      "Liver",
      "KUB",
      "KUB and Prostate",
      "Thyroid",
      "Inguinal",
      "Soft Tissue / Mass",
      "Prostate",
      "Inguino - Scrotal",
    ],
  },
  {
    key: "ecg",
    title: "ELECTROCARDIOGRAM",
    items: ["12-Lead ECG", "Neck"],
  },
];

export const BLOOD_CHEM_COL1_COUNT = 15;
