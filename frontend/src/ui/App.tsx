import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import PatientsPage from "./components/pages/patients/PatientsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PatientsHome from "./components/pages/patients/PatientsHome";
import PatientPage from "./components/pages/patients/PatientPage";
import ConsultationsForm from "./components/pages/consultations/ConsultationsForm";
import ConsultationDetails from "./components/pages/consultations/ConsultationDetails";
import SettingsPage from "./components/pages/settings/SettingsPage";
import AuthPage from "./components/pages/auth/AuthPage";
import { Toaster } from "./components/shadcn/sonner";
import ProtectedRoute from "./components/pages/auth/ProtectedRoute";
import AuthGate from "./components/pages/auth/AuthGate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
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
            path="patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientsHome />} />
            <Route path=":patientId" element={<PatientPage />} />
            <Route
              path=":patientId/consultations/new"
              element={<ConsultationsForm />}
            />
            <Route
              path=":patientId/consultations/:consultationId/edit"
              element={<ConsultationsForm />}
            />
            <Route
              path=":patientId/consultations/:consultationId/details"
              element={<ConsultationDetails />}
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
        </Route>
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
