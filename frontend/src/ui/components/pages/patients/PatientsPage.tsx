import { Outlet } from "react-router";

function PatientsPage() {
  return (
    <div className="flex h-screen w-full flex-col px-8 pt-8">
      <Outlet />
    </div>
  );
}

export default PatientsPage;
