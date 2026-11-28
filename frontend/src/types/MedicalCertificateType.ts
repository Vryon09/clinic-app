export type MedicalCertificateTemplateType =
  | "GENERAL_CLEARANCE"
  | "CONSULTATION_DIAGNOSIS"
  | "PRE_EMPLOYMENT_PE";

export type MedCertFitnessClass =
  | "CLASS_A"
  | "CLASS_B"
  | "CLASS_C"
  | "CLASS_D"
  | "";

export interface IMedCertVitalSigns {
  temp?: string;
  heartRate?: string;
  respiratoryRate?: string;
  bp?: string;
}

export interface IMedCertPhysicalExam {
  generalAppearance?: string;
  heent?: string;
  neck?: string;
  chest?: string;
  heart?: string;
  abdomen?: string;
  extremities?: string;
}

export interface IMedCertLabResults {
  cbc?: string;
  urinalysis?: string;
  fecalysis?: string;
  ecg?: string;
  hepaBScreening?: string;
  cxr?: string;
  others?: string;
}

export interface IMedCertDoctor {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  licenseNum?: string | null;
}

export interface IMedicalCertificate {
  id: string;
  patientId: string;
  doctorId: string | null;
  doctor?: IMedCertDoctor | null;
  templateType: MedicalCertificateTemplateType;
  certificateDate: string;
  dateSeen?: string | null;
  reasonForVisit?: string | null;
  vitalSigns?: string | null;
  physicalExam?: string | null;
  labResults?: string | null;
  fitnessClass?: string | null;
  diagnosis?: string | null;
  remarks?: string | null;
  purpose?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalCertificatePayload {
  patientId: string;
  doctorId?: string | null;
  templateType: MedicalCertificateTemplateType;
  certificateDate?: string;
  dateSeen?: string | null;
  reasonForVisit?: string | null;
  vitalSigns?: IMedCertVitalSigns;
  physicalExam?: IMedCertPhysicalExam;
  labResults?: IMedCertLabResults;
  fitnessClass?: string | null;
  diagnosis?: string | null;
  remarks?: string | null;
  purpose?: string | null;
}

export interface UpdateMedicalCertificatePayload {
  id: string;
  doctorId?: string | null;
  templateType?: MedicalCertificateTemplateType;
  certificateDate?: string;
  dateSeen?: string | null;
  reasonForVisit?: string | null;
  vitalSigns?: IMedCertVitalSigns;
  physicalExam?: IMedCertPhysicalExam;
  labResults?: IMedCertLabResults;
  fitnessClass?: string | null;
  diagnosis?: string | null;
  remarks?: string | null;
  purpose?: string | null;
}
