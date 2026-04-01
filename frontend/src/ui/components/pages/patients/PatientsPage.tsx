import { Outlet } from "react-router";
import BackButton from "../../BackButton";

function PatientsPage() {
  return (
    <div>
      <BackButton />
      <Outlet />
    </div>
  );
}

export default PatientsPage;
