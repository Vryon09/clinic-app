import { Outlet } from "react-router";

function PatientsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default PatientsPage;
