import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import { useQuery } from "@tanstack/react-query";
import { handleGetPatients } from "@/services/apiPatients";

function PatientsPage() {
  const { data: patients } = useQuery({
    queryFn: handleGetPatients,
    queryKey: ["patients"],
  });

  console.log(patients);

  return (
    <div>
      <AddPatient />
      <PatientsTable />
    </div>
  );
}

export default PatientsPage;
