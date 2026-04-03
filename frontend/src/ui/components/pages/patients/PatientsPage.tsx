import { Outlet } from "react-router";
import BackButton from "../../BackButton";

function PatientsPage() {
  return (
    <div className="flex h-full flex-col">
      <BackButton />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default PatientsPage;
