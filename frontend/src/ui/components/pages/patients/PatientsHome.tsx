import PatientsTable from "./PatientsTable";
import AddPatient from "./AddPatient";

function PatientsHome() {
  return (
    <div>
      <AddPatient />
      <PatientsTable />
    </div>
  );
}

export default PatientsHome;
