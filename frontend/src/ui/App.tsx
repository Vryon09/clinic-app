import { Route, Routes } from "react-router";
import { AuthPage } from "./components/auth/AuthPage";
import { HomePage } from "./components/home/HomePage";
import { AppLayout } from "./components/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
