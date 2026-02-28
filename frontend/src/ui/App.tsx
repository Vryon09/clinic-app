import { Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import PatientsPage from "./components/pages/patients/PatientsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PatientsHome from "./components/pages/patients/PatientsHome";
import PatientPage from "./components/pages/patients/PatientPage";
import ConsultationPage from "./components/pages/consultations/ConsultationPage";
import ConsultationsForm from "./components/pages/consultations/ConsultationsForm";
import SelectPatient from "./components/pages/consultations/SelectPatient";

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
          <Route path="patients" element={<PatientsPage />}>
            <Route index element={<PatientsHome />} />
            <Route path="/patients/:id" element={<PatientPage />} />
          </Route>
          <Route path="consultations" element={<ConsultationPage />}>
            <Route index element={<SelectPatient />} />
            <Route path="/consultations/:id" element={<ConsultationsForm />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
