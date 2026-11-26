export type LabRequestCategoryKey =
  | "laboratory"
  | "bloodChemistry"
  | "ultrasound"
  | "xray"
  | "twoDEcho"
  | "ecg";

export type ILabRequestSelectedTests = Partial<
  Record<LabRequestCategoryKey, string[]>
>;

export interface ILabRequestCustomTests {
  bloodChemistryOthers?: string;
  xrayOthers?: string;
  ecgOthers?: string;
}

export interface ILabRequestDoctor {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  licenseNum?: string | null;
}

export interface ILabRequest {
  id: string;
  patientId: string;
  doctorId: string | null;
  doctor?: ILabRequestDoctor | null;
  requestDate: string;
  selectedTests: string;
  customTests?: string | null;
  otherExaminations?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabRequestPayload {
  patientId: string;
  doctorId?: string | null;
  requestDate?: string;
  selectedTests: ILabRequestSelectedTests;
  customTests?: ILabRequestCustomTests;
  otherExaminations?: string;
  notes?: string;
}

export interface UpdateLabRequestPayload {
  id: string;
  doctorId?: string | null;
  requestDate?: string;
  selectedTests?: ILabRequestSelectedTests;
  customTests?: ILabRequestCustomTests;
  otherExaminations?: string;
  notes?: string;
}
