import { Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import PatientsPage from "./components/pages/patients/PatientsPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PatientsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
