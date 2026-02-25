import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";
import { useQuery } from "@tanstack/react-query";
import { handleGetPatients } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";

function PatientsPage() {
  const { data: patients, isPending } = useQuery<IPatient[]>({
    queryFn: handleGetPatients,
    queryKey: ["patients"],
  });

  return (
    <div>
      <AddPatient />
      {!isPending && <PatientsTable patients={patients} />}
    </div>
  );
}

export default PatientsPage;
