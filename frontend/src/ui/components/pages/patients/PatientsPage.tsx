import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import PatientsTable from "./PatientsTable";

function PatientsPage() {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button className="cursor-pointer">
          <Plus /> <span>Add Patient</span>
        </Button>
      </div>
      <PatientsTable />
    </div>
  );
}

export default PatientsPage;
