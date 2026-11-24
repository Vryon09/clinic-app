export type DashboardRange = "7d" | "30d" | "90d";

export interface DashboardKPIs {
  activePatients: number;
  newPatientsInRange: number;
  activeCases: number;
  recordsToday: number;
  totalRecordsInRange: number;
  labResultsInRange: number;
  totalLabResults: number;
}

export interface ConsultationTrendPoint {
  date: string;
  count: number;
}

export interface TopClinicalItem {
  name: string;
  count: number;
}

export interface RecentConsultationItem {
  id: string;
  visitDate: string;
  diagnosis?: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  case: {
    id: string;
    caseName: string;
  };
  createdBy: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface RecentLabResultItem {
  id: string;
  filePath: string;
  uploadedAt: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface DemographicsData {
  male: number;
  female: number;
  withAllergies: number;
  ageBuckets: {
    "0-17": number;
    "18-35": number;
    "36-59": number;
    "60+": number;
  };
}

export interface DoctorWorkloadItem {
  doctorName: string;
  count: number;
}

export interface AdminSnapshot {
  activeUsersCount: number;
  isGoogleDriveConnected: boolean;
  recentLogs: Array<{
    id: string;
    action: string;
    module: string;
    target: string;
    details: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      role: string;
    };
  }>;
}

export interface DashboardSummaryResponse {
  kpis: DashboardKPIs;
  consultationTrends: ConsultationTrendPoint[];
  topDiagnoses: TopClinicalItem[];
  topMedications: TopClinicalItem[];
  recentConsultations: RecentConsultationItem[];
  recentLabResults: RecentLabResultItem[];
  demographics: DemographicsData;
  doctorWorkload: DoctorWorkloadItem[];
  adminSnapshot?: AdminSnapshot | null;
}
