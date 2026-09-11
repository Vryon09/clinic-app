import { Outlet } from "react-router";

function PatientsPage() {
  return (
    <div className="w-full flex-1">
      <Outlet />
    </div>
  );
}

export default PatientsPage;
