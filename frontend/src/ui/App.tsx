import { Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import PatientsPage from "./components/pages/patients/PatientsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PatientsHome from "./components/pages/patients/PatientsHome";
import PatientPage from "./components/pages/patients/PatientPage";
import ConsultationsForm from "./components/pages/consultations/ConsultationsForm";
import Dashboard from "./components/pages/home/Dashboard";
import ConsultationDetails from "./components/pages/consultations/ConsultationDetails";

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
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientsPage />}>
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
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
