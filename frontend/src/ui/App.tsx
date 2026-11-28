import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import PatientsPage from "./components/pages/patients/PatientsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerUnauthorizedHandler } from "@/lib/api";
import { resetClientSessionState } from "@/lib/patientNavigation";
import PatientsHome from "./components/pages/patients/PatientsHome";
import PatientPage from "./components/pages/patients/PatientPage";
import ConsultationsForm from "./components/pages/consultations/consultationForms/ConsultationsForm";
import ConsultationDetails from "./components/pages/consultations/recordDetails/ConsultationDetails";
import SettingsPage from "./components/pages/settings/SettingsPage";
import AuthPage from "./components/pages/auth/AuthPage";
import { Toaster } from "./components/shadcn/sonner";
import ProtectedRoute from "./components/pages/auth/ProtectedRoute";
import AuthGate from "./components/pages/auth/AuthGate";
import BillingPage from "./components/pages/billing/BillingPage";
import InvoiceDetailPage from "./components/pages/billing/InvoiceDetailPage";
import InvoicePrintView from "./components/pages/billing/InvoicePrintView";
import ReceiptPrintView from "./components/pages/billing/ReceiptPrintView";
import LabRequestPrintView from "./components/pages/labRequests/LabRequestPrintView";
import MedicalCertificatePrintView from "./components/pages/medicalCertificates/MedicalCertificatePrintView";
import { FeatureRoute } from "./components/common/FeatureGate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  useEffect(() => {
    const unregisterUnauthorized = registerUnauthorizedHandler(() => {
      resetClientSessionState(queryClient);
    });

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        resetClientSessionState(queryClient);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      unregisterUnauthorized();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="auth" replace />} />
          <Route
            path="auth"
            element={
              <AuthGate>
                <AuthPage />
              </AuthGate>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="dashboard">
                  <DashboardPage />
                </FeatureRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="patients"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="patients">
                  <PatientsPage />
                </FeatureRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientsHome />} />
            <Route path=":patientId" element={<PatientPage />} />
            <Route
              path=":patientId/consultations/new"
              element={
                <FeatureRoute feature="patients.consultations">
                  <ConsultationsForm />
                </FeatureRoute>
              }
            />
            <Route
              path=":patientId/consultations/:consultationId/edit"
              element={
                <FeatureRoute feature="patients.consultations">
                  <ConsultationsForm />
                </FeatureRoute>
              }
            />
            <Route
              path=":patientId/consultations/:consultationId/details"
              element={
                <FeatureRoute feature="patients.consultations">
                  <ConsultationDetails />
                </FeatureRoute>
              }
            />
            <Route
              path=":patientId/lab-requests/print"
              element={
                <FeatureRoute feature="patients.labRequests">
                  <LabRequestPrintView />
                </FeatureRoute>
              }
            />
            <Route
              path=":patientId/medical-certificates/print"
              element={
                <FeatureRoute feature="patients.medicalCertificates">
                  <MedicalCertificatePrintView />
                </FeatureRoute>
              }
            />
          </Route>

          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="billing"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="billing">
                  <BillingPage />
                </FeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="billing/invoices/:invoiceId"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="billing">
                  <InvoiceDetailPage />
                </FeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="billing/invoices/:invoiceId/print"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="billing">
                  <InvoicePrintView />
                </FeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="billing/receipts/:paymentId/print"
            element={
              <ProtectedRoute>
                <FeatureRoute feature="billing">
                  <ReceiptPrintView />
                </FeatureRoute>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
