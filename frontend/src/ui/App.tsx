import { Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import PatientsPage from "./components/pages/patients/PatientsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          <Route path="/" element={<PatientsPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
