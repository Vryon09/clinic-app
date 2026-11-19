export interface PatientNavigationContext {
  returnUrl: string;
  patientName?: string;
  contextLabel?: string;
  timestamp?: number;
}

const STORAGE_KEY = "clinicsync_patient_return_context";

export function savePatientReturnContext(context: Omit<PatientNavigationContext, "timestamp">): void {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...context, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export function getPatientReturnContext(): PatientNavigationContext | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatientNavigationContext;
    // Expire context after 2 hours
    if (parsed.timestamp && Date.now() - parsed.timestamp > 2 * 60 * 60 * 1000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPatientReturnContext(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
